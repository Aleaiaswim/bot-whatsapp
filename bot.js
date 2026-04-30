const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const delay = ms => new Promise(res => setTimeout(res, ms));
const sesiones = {};

// detectar número
function detectarNumero(texto) {
    texto = texto.toLowerCase();
    const mapa = {
        '1':1,'uno':1,
        '2':2,'dos':2,
        '3':3,'tres':3,
        '4':4,'cuatro':4
    };
    for (let p in mapa) {
        if (texto.includes(p)) return mapa[p];
    }
    return null;
}

// detectar intención
function detectarIntencion(msg) {
    msg = msg.toLowerCase();

    if (
        msg.includes('hola') ||
        msg.includes('buen') ||
        msg.includes('info') ||
        msg.includes('clases') ||
        msg.includes('horario')
    ) return 'inicio';

    if (msg.includes('pag') || msg.includes('comprobante')) return 'pago';

    if (
        msg.includes('listo') ||
        msg.includes('ya') ||
        msg.includes('registr')
    ) return 'registro';

    if (
        msg.includes('no puedo') ||
        msg.includes('no me llega') ||
        msg.includes('no llega')
    ) return 'problema';

    return 'otro';
}

// detectar datos
function detectarDatos(msg) {
    msg = msg.toLowerCase();

    return {
        nombre: msg.split(' ').length >= 2,
        edad: /\d{1,2}/.test(msg),
        fecha: msg.includes('/') || msg.includes('-')
    };
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('BOT LISTO 🚀');
});

client.on('message', async message => {

    if (message.from === 'status@broadcast') return;
    if (message.from.includes('@g.us')) return;

    const chat = message.from;
    const msg = message.body.toLowerCase();
    const intencion = detectarIntencion(msg);

    if (!sesiones[chat]) sesiones[chat] = { paso: 0 };

    // =========================
    // PASO 0 → INICIO
    // =========================
    if (intencion === 'inicio' && sesiones[chat].paso === 0) {

        sesiones[chat].paso = 1;

        await message.reply(`Hola buen día!
Agradecemos su interés en Aleaia Swim Escuela de Natacion✨☺️🏊🏻‍♀️`);

        await delay(1200);

        await client.sendMessage(chat, `Impartimos clases de natación y aquarobics🏊🏻‍♂️🏊🏻‍♀️✨3 años 5 meses en adelante✨ 

✅ Maestros expertos y 100% capacitados
✅ Alberca con calefacción
✅Grupos pequeños para atención personalizada
✅Instalaciones privadas y entorno seguro.
✅Horarios flexibles que se adaptan a ti`);

        await delay(1200);

        await client.sendMessage(chat, `Le compartimos nuestros horarios actuales:`);
        await client.sendMessage(chat, MessageMedia.fromFilePath('./horarios.jpg'));

        await delay(1200);

        await client.sendMessage(chat, `Así como nuestros costos por clases que desee tomar al mes:`);
        await client.sendMessage(chat, MessageMedia.fromFilePath('./precios.jpg'));

        await delay(1200);

        await client.sendMessage(chat, `Contamos con el sistema de HORARIOS FLEXIBLES, los alumnos reservan sus horarios por medio de nuestra pagina web💻`);
        await client.sendMessage(chat, MessageMedia.fromFilePath('./proceso.jpg'));

        await delay(1200);

        await client.sendMessage(chat, `📍Nos ubicamos en Avenida Primero de mayo 1607 colonia Los Mangos, pasando el Tec de Madero.
https://maps.google.com/maps?q=22.25567626953125%2C-97.85128021240234&z=17&hl=es`);

        await delay(1200);

        await client.sendMessage(chat, `El material de clase es brindado por la escuela y como requisitos se solicita traer: 
- Traje de baño o ropa de lycra 
- Gorra de natación, se adquiere en nuestra escuela, es uniforme y tiene un costo de 200 
- Googles de natación (no son requisito en clase de aquarobics)`);

        await delay(1200);

        await client.sendMessage(chat, `Cuántas clases quisiera tomar a la semana?🏊🏻‍♀️🏊🏻‍♂️✨`);

        return;
    }

    // =========================
    // PASO 1 → CLASES
    // =========================
    if (sesiones[chat].paso === 1) {

        const numero = detectarNumero(msg);

        if (!numero) {
            await client.sendMessage(chat, `Cuántas clases quisiera tomar a la semana?🏊🏻‍♀️🏊🏻‍♂️✨`);
            return;
        }

        sesiones[chat].paso = 2;

        let clases = 8;
        let precio = 850;

        if (numero === 3) {
            clases = 12;
            precio = 1350;
        }

        if (numero >= 4) {
            clases = 16;
            precio = 1550;
        }

        await client.sendMessage(chat, `Su paquete seria el de ${clases} clases, el paquete tiene un costo de ${precio} y la inscripción 550🏊🏻‍♂️🏊🏻‍♀️`);

        await delay(1200);

        await client.sendMessage(chat, `Le proporcionamos los datos de la tarjeta a la cual puede realizar su depósito o transferencia 👍🏻`);
        await client.sendMessage(chat, MessageMedia.fromFilePath('./banco.jpg'));

        await delay(1200);

        await client.sendMessage(chat, `Una vez hecha la transferencia o deposito favor de enviar su comprobante para el apartado de su lugar😊una vez realizado el pago no hay reembolso, sin excepcion.`);

        return;
    }

    // =========================
    // PASO 2 → REGISTRO
    // =========================
    if (sesiones[chat].paso === 2 || intencion === 'pago') {

        sesiones[chat].paso = 3;

        sesiones[chat].datos = {
            nombre: false,
            edad: false,
            fecha: false
        };

        await client.sendMessage(chat, `Nos podría proporcionar la siguiente información del alumno(a) porfavor, es para el registro✨🙌🏻
- nombre completo 
- edad y fecha de nacimiento
- padece o padeció alguna discapacidad y/o actualmente tiene alguna enfermedad?`);

        await delay(1200);

        await client.sendMessage(chat, `Le enviamos el link para el registro de usuario en la página web de nuestra escuela☺️✨

https://aleaiaswim.com/register/`);

        await delay(1200);

        await client.sendMessage(chat, `Después de llenar el formulario de usuario le enviarán un correo de Aleaia Swim (puede llegar a spam) hay que dar clic en el link que contiene dicho correo para verificar su correo 😊`);

        await delay(1200);

        await client.sendMessage(chat, `Una vez que verifique su correo favor de notificarnos para proceder a activarle su membresía`);

        return;
    }

    // =========================
    // PASO 3 → VALIDACIÓN
    // =========================
    if (sesiones[chat].paso === 3) {

        const datosDetectados = detectarDatos(msg);

        if (datosDetectados.nombre) sesiones[chat].datos.nombre = true;
        if (datosDetectados.edad) sesiones[chat].datos.edad = true;
        if (datosDetectados.fecha) sesiones[chat].datos.fecha = true;

        if (intencion === 'problema') {
            await client.sendMessage(chat, `No se preocupe lo verificamos manualmente por usted`);
            return;
        }

        const completo =
            sesiones[chat].datos.nombre &&
            sesiones[chat].datos.edad &&
            sesiones[chat].datos.fecha;

        if (intencion === 'registro') {

            if (!completo) {
                await client.sendMessage(chat, `Nos podría proporcionar la siguiente información del alumno(a) porfavor, es para el registro✨🙌🏻
- nombre completo 
- edad y fecha de nacimiento
- padece o padeció alguna discapacidad y/o actualmente tiene alguna enfermedad?`);
                return;
            }

            sesiones[chat].paso = 4;

            await client.sendMessage(chat, `Recibidos datos de registro:)`);
        }
    }

});

client.initialize();