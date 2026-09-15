import { telegramService } from '../../services/telegram.service';
import { telegramBindingRepository } from '../../repositories/telegramBindingRepository';

const helpMessage = `
🛍️ Shopee Price Tracker Bot

Commands:
/start - Start bot and enter binding code
/bind CODE - Bind your account with code
/status - Show your binding status
/test - Send test notification
/help - Show this help message

To bind your account:
1. Login to the website
2. Go to Settings → Telegram
3. Click "Generate Binding Code"
4. Copy the code and send /bind YOUR_CODE here
`;

export const handleStart = async (ctx: any) => {
  const text = ctx.message?.text || '';
  const bindingCode = text.split(' ')[1];

  if (bindingCode) {
    try {
      await telegramService.bindUser(
        bindingCode,
        String(ctx.from?.id || ''),
        ctx.from?.username || null
      );

      await ctx.reply('✅ Account bound successfully! You will receive price drop notifications here.');
    } catch (error: any) {
      await ctx.reply(`❌ Error: ${error.message}`);
    }
  } else {
    await ctx.reply(
      '👋 Hello! I am Shopee Price Tracker bot.\n\n' +
      'Send your binding code from the website to connect your account.\n\n' +
      '/bind CODE - Bind account\n' +
      '/help - Show help'
    );
  }
};

export const handleBind = async (ctx: any) => {
  const text = ctx.message?.text || '';
  const bindingCode = text.split(' ')[1];

  if (!bindingCode) {
    await ctx.reply('❌ Please provide a binding code.\nUsage: /bind YOUR_CODE');
    return;
  }

  try {
    await telegramService.bindUser(
      bindingCode,
      String(ctx.from?.id || ''),
      ctx.from?.username || null
    );

    await ctx.reply('✅ Account bound successfully! You will receive price drop notifications here.');
  } catch (error: any) {
    await ctx.reply(`❌ Error: ${error.message}`);
  }
};

export const handleStatus = async (ctx: any) => {
  const binding = await telegramBindingRepository.findByTelegramUserId(String(ctx.from?.id || ''));

  if (!binding || !binding.isActive) {
    await ctx.reply('❌ You are not bound to any account.\n\nUse /bind CODE to connect your account.');
    return;
  }

  await ctx.reply(
    '✅ You are bound!\n\n' +
    `Telegram ID: ${binding.telegramUserId}\n` +
    `Telegram Username: @${binding.telegramUsername || 'N/A'}\n` +
    `Status: ${binding.isActive ? 'Active' : 'Inactive'}`
  );
};

export const handleTest = async (ctx: any) => {
  const binding = await telegramBindingRepository.findByTelegramUserId(String(ctx.from?.id || ''));

  if (!binding || !binding.isActive) {
    await ctx.reply('❌ You are not bound to any account.');
    return;
  }

  try {
    await telegramService.sendTestNotification(binding.telegramUserId);
    await ctx.reply('✅ Test notification sent! If you see this, everything is working.');
  } catch (error: any) {
    await ctx.reply(`❌ Failed to send test: ${error.message}`);
  }
};

export const handleHelp = async (ctx: any) => {
  await ctx.reply(helpMessage);
};
