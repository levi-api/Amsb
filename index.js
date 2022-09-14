//Créditos Wellinton/Levi
require('./datab/env/info')
const { 
default: WAConnection,
MessageType,
Presence,
GroupSettingChange,
WA_MESSAGE_STUB_TYPES,
Mimetype,
relayWAMessage,
makeInMemoryStore,
useSingleFileAuthState,
BufferJSON, 
DisconnectReason, 
fetchLatestBaileysVersion,
downloadContentFromMessage,
delay
} = require('@adiwajshing/baileys')
const fs = require('fs')
const chalk = require('chalk')
const P = require('pino') 
const fetch = require('node-fetch')
const { color } = require('./datab/lib/cores')
const ffmpeg = require('fluent-ffmpeg')
const moment = require('moment-timezone')
const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
const data = moment.tz('America/Sao_Paulo').format('DD/MM/YY')
const speed = require('performance-now')
const { banner, getGroupAdmins, getBuffer, getRandom, getExtension } = require('./datab/lib/funções')
const { fetchJson } = require('./datab/lib/fetcher')
const configurações = JSON.parse(fs.readFileSync('./datab/env/info.json'))
const registros = JSON.parse(fs.readFileSync('./datab/env/registros.json'))
const img = JSON.parse(fs.readFileSync('./datab/imgs/imagens.json'))
const { menu } = require('./datab/menus/principal.js');
// Informações 

prefixo = configurações.prefixo
nomeBot = configurações.nomeBot
nomeDono = configurações.nomeDono
numeroDono = configurações.numeroDono
logo = img.menu

// Funções
let girastamp = speed()
let latensi = speed() - girastamp

// Contato do dono
const vcard = 'BEGIN:VCARD\n'
+ 'VERSION:3.0\n' 
+ 'FN:Wellinton\n' // Nome completo
+ 'ORG:LVDEV;\n' // A organização do contato
+ 'TEL;type=CELL;type=VOICE;waid=558981457096:+55 89 8145 7096\n' // WhatsApp ID + Número de telefone
+ 'END:VCARD' // Fim do ctt

// Início da conexão
async function starts() {
const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })

//Conexão com o qr
const loadState = () => {
var state
try {
const value = JSON.parse(fs.readFileSync('./datab/qr-code/auth_info_multi.json', { encoding: 'utf-8' }), BufferJSON.reviver)
state = { 
creds: value.creds, 
keys: initInMemoryKeyStore(value.keys) 
}
} catch {}
return state
}

const { state, saveState } = useSingleFileAuthState('./datab/qr-code/auth_info_multi.json')
console.log(banner.string)
console.log()
console.log()
console.log('\033[1;32mAmsb 1.0 conectando ✓\x1b[1;37m')
console.log()
const conn = WAConnection({
logger: P({ level: 'silent'}),
printQRInTerminal: true,
auth: state
})
store.bind(conn.ev)

conn.ev.on('chats.set', () => {
//pode usar 'store.chats' como quiser, mesmo depois que o soquete morre
// 'chats' => uma instância keyedDB
console.log('Tem conversas', store.chats.all())
})
conn.ev.on('contacts.set', () => {
console.log('Tem contatos', Object.values(store.contacts))
})
conn.ev.on('creds.update', saveState)


// Chat update
// Ouvir quando as credenciais auth é atualizada
conn.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 
await conn.readMessages(info.key.remoteJid, info.key.participant, [info.key.id])
if (info.key && info.key.remoteJid == 'status@broadcast') return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]
global.prefixo

const content = JSON.stringify(info.message)
const from = info.key.remoteJid

// Body
var body = (type === 'conversation') ?
info.message.conversation : (type == 'imageMessage') ?
info.message.imageMessage.caption : (type == 'videoMessage') ?
info.message.videoMessage.caption : (type == 'extendedTextMessage') ?
info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ?
info.message.listResponseMessage.singleSelectenviar.selectedRowId : (type == 'templateButtonenviarMessage') ?
info.message.templateButtonenviarMessage.selectedId : ''
const args = body.trim().split(/ +/).slice(1)
const isCmd = body.startsWith(prefixo)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null

// Bady
bady = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (info.message.listResponseMessage && info.message.listResponseMessage.singleSelectenviar.selectedRowId) ? info.message.listResponseMessage.singleSelectenviar.selectedRowId: ''

// Budy
budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

//===

button = (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedDisplayText : ''
button = (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : ''
listMessage = (type == 'listResponseMessage') ? info.message.listResponseMessage.title : ''

var pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''

bidy =  budy.toLowerCase()

// Enviar gifs
const enviargif = (videoDir, caption) => {
conn.sendMessage(from, {
video: fs.readFileSync(videoDir),
caption: caption,
gifPlayback: true
})
}

// Enviar imagens
const enviarimg = (imageDir, caption) => {
conn.sendMessage(from, {
image: fs.readFileSync(imageDir),
caption: caption
})
}

// Enviar figs
const enviarfig = async (figu, tag) => {
bla = fs.readFileSync(figu)
conn.sendMessage(from, {sticker: bla}, {quoted: info})
}

// Envia imagem com botão
const enviarImgB = async (id, img1, text1, desc1, but = [], vr) => {
buttonMessage = {
image: {url: img1},
caption: text1,
footerText: desc1,
buttons: but,
headerType: 4
}
conn.sendMessage(id, buttonMessage, {quoted: vr})
}

const getFileBuffer = async (mediakey, MediaType) => { 
const stream = await downloadContentFromMessage(mediakey, MediaType)

let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
const arg = body.substring(body.indexOf(' ') + 1)
const argss = body.split(/ +/g)
const testat = body
const ants = body
const isGroup = info.key.remoteJid.endsWith('@g.us')
const tescuk = ['0@s.whatsapp.net']
const q = args.join(' ')
const sender = isGroup ? info.key.participant : info.key.remoteJid
const pushname = info.pushName ? info.pushName : ''
const isRegistro = registros.includes(sender)
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupDesc = isGroup ? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const text = args.join(' ')
const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? conn.sendMessage(from, {text: teks.trim(), mentions: memberr}) : conn.sendMessage(from, {text: teks.trim(), mentions: memberr})
}

resposta = {
espere: '*[❕] Okay, aguarde um momento...*',
grupo: '*[❕] Esse comando só pode ser usado em grupo!*',
privado: '*[❕] Esse comando só pode ser usado no privado!*',
adm: '*[❕] Esse comando só pode ser usado por um adm*',
botadm: '*[❕] Adm necessário para utilizar esse comando!*',
registro: `*[❕️] Você não se registrou utilize ${prefixo}rg para se registrar!*`,
norg: '*[❕️] Você ja está registrado!*',
erro: '*[❕] Error no cmd!*',
dono: '*[❕] Somente meu mestre pode usar esse comando!!*'
}

// Selo de verificado
const ContatVR = {key : {participant : '0@s.whatsapp.net'},message: {contactMessage:{displayName: `${pushname}`}}}
const LiveVR = {key : {participant : '0@s.whatsapp.net'},message: {liveLocationMessage: {}}}
const ImagenVR = {key : {participant : '0@s.whatsapp.net'},message: {imageMessage: {}}}
const VideoVR = {key : {participant : '0@s.whatsapp.net'},message: {videoMessage: {}}}
const DocVR = {key : {participant : '0@s.whatsapp.net'},message: {documentMessage:{}}}

// Consts dono/adm etc...
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).mimetype || ""
const numeroBot = conn.user.id.split(':')[0]+'@s.whatsapp.net'
const isBot = info.key.fromMe ? true : false
const isBotGroupAdmins = groupAdmins.includes(numeroBot) || false
const isGroupAdmins = groupAdmins.includes(sender) || false 
const argis = bidy.trim().split(/ +/)
const isOwner = sender.includes(numeroDono)
const enviar = (texto) => {
conn.sendMessage(from, { text: texto }, {quoted: info}) }

// Consts isQuoted
const isImage = type == 'imageMessage'
const isVideo = type == 'videoMessage'
const isAudio = type == 'audioMessage'
const isSticker = type == 'stickerMessage'
const isContact = type == 'contactMessage'
const isLocation = type == 'locationMessage'
const isProduct = type == 'productMessage'
const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')
typeMessage = body.substr(0, 50).replace(/\n/g, '')
if (isImage) typeMessage = 'Image'
else if (isVideo) typeMessage = 'Video'
else if (isAudio) typeMessage = 'Audio'
else if (isSticker) typeMessage = 'Sticker'
else if (isContact) typeMessage = 'Contact'
else if (isLocation) typeMessage = 'Location'
else if (isProduct) typeMessage = 'Product'
const isQuotedMsg = type === 'extendedTextMessage' && content.includes('textMessage')
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')

//Mensagems do console

if (!isGroup && isCmd) console.log('\033[1;31m~\x1b[1;37m>', '[\x1b[0;31mComando\x1b[1;37m]', hora, color(comando), 'de ', color(sender.split('@')[0]))

if (!isGroup && !isCmd && !info.key.fromMe) console.log('\033[1;31m~\x1b[1;37m>', '[\033[0;34mMensagem\x1b[1;37m]', 'de ', color(sender.split('@')[0]))

if (isCmd && isGroup) console.log('\033[1;31m~\x1b[1;37m>', '[\x1b[0;31mComando\x1b[1;37m]', hora, color(comando), 'de ', color(sender.split('@')[0]), 'Gp: ', color(groupName))

if (!isCmd && isGroup && !info.key.fromMe) console.log('\033[1;31m~\x1b[1;37m>', '[\033[0;34mMensagem\x1b[1;37m]',  'de ', color(sender.split('@')[0]), 'Gp: ', color(groupName))

// Começo dos comandos com prefix
switch(comando) {

case 'registrar':
case 'rg':
if (isRegistro) return enviar(resposta.norg)
try {
registros.push(sender)
fs.writeFileSync('./datab/env/registros.json',JSON.stringify(registros))
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
enviar(resposta.espere)
await delay(10000)
enviar(`💫 Registrado com sucesso 💥

🧑‍💻 Nome: ${pushname}
🛸 Número: ${sender.split('@')[0]}
📅 Data: ${data}
🕗 Horário: ${hora}
♨️ Celular: ${info.key.id.length > 21 ? 'Android 😴' : info.key.id.substring(0, 2) == '3A' ? 'IOS 😑' : 'WhatsApp web 😅'}

🎉 Parabéns por se registrar 🎉`)
break

case 'menu':
case 'help':
case 'cmds':
if (!isRegistro) return enviar(resposta.registro)
ft = await getBuffer(`${logo}`) 
await conn.sendMessage(from, {image: ft, caption: menu(pushname, sender, data, hora, prefixo)}, {quoted: ImagenVR})
break 

case 'toimg':
if (!isRegistro) return enviar(resposta.registro)
if (!isQuotedSticker) return enviar('Marca uma fig, seu animal')
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
enviar(resposta.espere)
try {
conn.sendMessage(from, {image: buff}, {quoted: DocVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'perfil':
if (!isRegistro) return enviar(resposta.registro)
try {
ppimg = await conn.profilePictureUrl(`${sender.split('@')[0]}@c.us`, 'image')
} catch(e) {
ppimg = logo
}
perfil = await getBuffer(ppimg)
enviar(resposta.espere)
try {
conn.sendMessage(from, {
image: perfil,
caption: `
🥀🎭 Seu perfil 🎃💫

🧑‍💻 Nome: ${pushname}
🛸 Número: ${sender.split('@')[0]}
📅 Data: ${data}
🕗 Horário: ${hora}
♨️ Celular: ${info.key.id.length > 21 ? 'Android 😴' : info.key.id.substring(0, 2) == '3A' ? 'IOS 😑' : 'WhatsApp web 😅'}
`
}, {quoted: ContatVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'suporte':
case 'dono':
if (!isRegistro) return enviar(resposta.registro)
enviar(resposta.espere)
await delay(5000)
try {
conn.sendMessage(from, { contacts: { displayName: `${nomeDono}`, contacts: [{ vcard }]
}})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'ping':
if (!isRegistro) return enviar(resposta.registro)
enviar(resposta.espere)
enviar(`Velocidade de resposta ${latensi.toFixed(4)} segundos`)
break

case 'sair':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
enviar('Adeus my amigos 😔')
try {
await conn.groupLeave(from)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'executar':
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if (args.length < 1) return enviar('Vou executar o vento?')
try {
ev = body.slice(comando.length + 2)
JSON.stringify(eval(ev.replace('await', '')))
} catch(e) {
enviar(e)
console.log(e)
}
break

case 'gplink':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
const link = await conn.groupInviteCode(from)
enviar(`Link do grupo : https://chat.whatsapp.com/${link}`)
break

case 'resetarlink':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await conn.groupRevokeInvite(from)
enviar('Link de convite resetado com sucesso ✓')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'gp':
case 'grupo':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
if (q == 'abrir') {
await conn.groupSettingUpdate(from, 'not_announcement')
enviar('Grupo aberto com sucesso')
}
if (q == 'fechar') {
await conn.groupSettingUpdate(from, 'announcement')
enviar('Grupo fechado com sucesso')
}
if (q == 'livrar') {
await conn.groupSettingUpdate(from, 'unlocked')
enviar('Grupo livre com sucesso')
}
if (q == 'limitar') {
await conn.groupSettingUpdate(from, 'locked')
enviar('Grupo limitado com sucesso')
}
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'infogp':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
enviar(`
👻 Nome : ${groupName}
☔ Descrição : ${groupDesc}
🧭 Id : ${from}
📅 Data : ${data}
🕗 Horário : ${hora}
`)
break

case 'mudardk':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await conn.groupUpdateDescription(from, `${q}`)
enviar('Descrição alterada com sucesso ✓')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'mudarnm':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await conn.groupUpdateSubject(from, `${q}`)
enviar('Nome alterado com sucesso ✓')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'rebaixar':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (q < 1) return enviar('Digite o número, animal')
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
conn.groupParticipantsUpdate(from, [`${q}@s.whatsapp.net`], 'demote')
enviar(`${q} Foi rebaixado a membro comum com sucesso ✓`)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'promover':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
if (q < 1) return enviar('Cade o número, mongolóide')
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
conn.groupParticipantsUpdate(from, [`${q}@s.whatsapp.net`], 'promote')
enviar(`${q} Foi promovido a adm com sucesso ✓`)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'seradm':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
conn.groupParticipantsUpdate(from, [`${sender}`], 'promote')
enviar('Okay, mestre agora você e adm ✓')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'sermembro':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
conn.groupParticipantsUpdate(from, [`${sender}`], 'demote')
enviar('Okay, mestre agora você e um membro ✓')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'banir':
if (!isGroup) return enviar(resposta.grupo)
if (!isGroupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
if (info.message.extendedTextMessage != undefined || info.message.extendedTextMessage != null) {
num = info.message.extendedTextMessage.contextInfo.participant
if(numeroBot.includes(num)) return enviar('felizmente não posso me auto remover, terá que fazer isso manualmente')
if(numeroDono.includes(num)) return enviar('infelizmente não posso remover meu dono')
conn.sendMessage(from, {text: `Adeus ${num.split('@')[0]}`, mentions: [num]}, {quoted: info})
conn.groupParticipantsUpdate(from, [num], 'remove')
} else { 
enviar('Marque a mensagem da pessoa!')
}
break

case 'marcar':
if (!isGroup) return enviar(resposta.grupo)
if (!isRegistro) return enviar(resposta.registro)
if (!groupAdmins) return enviar(resposta.adm)
try {
members_id = []
teks = (args.length > 1) ? body.slice(8).trim() : ''
teks += '\n\n'
for (let mem of groupMembers) {
teks += `*</>* @${mem.id.split('@')[0]}\n`
members_id.push(mem.id)
}
mentions(teks, members_id, true)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'admins':
case 'listadmins':  
case 'listaadmins':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
teks = `Lista de administradores do grupo *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
no = 0
for (let admon of groupAdmins) {
no += 1
teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
}
mentions(teks, groupAdmins, true)
break

default:

// Comandos sem prefix
switch(testat){
}

// Resposta quando o comando não é encontrado
if (isCmd) return enviar(`Comando não encontrado digite ${prefixo}menu para ver a lista de comandos disponíveis!`)

if (budy.includes('bot corno') || (budy.includes('Bot corno'))){
enviar('Corno é você, seu animal')
}

if (messagesC == 'corno'){
tujuh = fs.readFileSync('./arquivos/audios/corno.mp3')
await conn.sendMessage(from, {audio: tujuh, mimetype: 'audio/mp4', ptt:true}, {quoted: DocVR})
}

// Enviar as figs
if (messagesC == `${nomeBot}`){
 conn.sendMessage(from,{sticker: fs.readFileSync('./datab/figs/bot.webp')})
}
if (messagesC == 'Flw'){
 conn.sendMessage(from,{sticker: fs.readFileSync('./datab/figs/flw.webp')})
}
if (messagesC == 'Oi'){
 conn.sendMessage(from,{sticker: fs.readFileSync('./datab/figs/oi.webp')})
}
if (messagesC == 'Bot otario'){
 conn.sendMessage(from,{sticker: fs.readFileSync('./datab/figs/otaro.webp')})
}
if (messagesC == 'Sono'){
 conn.sendMessage(from,{sticker: fs.readFileSync('./datab/figs/sono.webp')})
}

}

} catch (erro) {
console.log(erro)
}})

conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update

if(connection === 'close') {
console.log('\033[1;30mConexão fechada.\x1b[1;37m')
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  

if(connection === 'connecting') {
console.log('\033[1;30mRefazendo conexão...\x1b[1;37m')

if(connection === 'open') {
console.log('\033[1;32mAmsb 1.0 conectando ✓\x1b[1;37m')

starts()
}}}

if(update.isNewLogin) {
starts()
}})}
starts()
