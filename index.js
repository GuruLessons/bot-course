

const TelegramApi = require('node-telegram-bot-api');
const token = '6712816223:AAHfpAwosy7Z2LNbKEOeq8KgkZwonE5B6dg';
const {gameoptions, againoptions} = require('./options');
const chats = {};
const bot = new TelegramApi(token, {polling: true});



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, а ты должен ее отгадать!`);    
    const randNumber = Math.floor(Math.random()*10);
    chats[chatId] = randNumber;
    await bot.sendMessage(chatId, `Отгадывай!`, gameoptions);
}

function start() {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию'},
        {command: '/game', description: 'Игра отгадай цифру'}
    ]);
    
    
    
    bot.on('message', async msg => {
        const text = msg.text;
    
        const chatId = msg.chat.id;
        if (text === '/start') {
            //await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.jpg');
            await bot.sendSticker(chatId, '7.jpg');
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот GURULessons`);    
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} ${msg.from.last_name}`);    
        }
        if (text === '/game') return startGame(chatId);
        console.log(msg);
        return bot.sendMessage(chatId, 'Я тебя не понимаю');
        //bot.sendMessage(chatId, `Ты написал мне: ${text}`);
        
    });
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') return startGame(chatId);
        if (Number(data) === chats[chatId]) {
            return bot.sendMessage(chatId, 'Ты отгадл!', againoptions);

        }
        else {
            return bot.sendMessage(chatId, `Увы, ты проиграл. Моя цифра: ${chats[chatId]}`, againoptions);

        }
        //await bot.sendMessage(chatId, `Нажата кнопка: ${data}`);
        //console.log(msg);
    })

}

start();
