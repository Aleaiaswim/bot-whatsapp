const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

let estados = {};

client.on('qr', qr => {
    console.log('ESCANEA ESTE QR:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('BOT LISTO 🚀');
});

client.on('message', async msg => {

    const chat = msg.from;
    const texto = msg.body.toLowerCase();

    if (!estados[chat]) {
        estados[chat] = { paso: 0, datos: false };
    }

    // 🔥 SALUDO (INICIO)
    if (
        texto.includes('hola') ||
        texto.includes('buenas') ||
        texto.includes('informes') ||
        texto.includes('?')
    ) {
        estados[chat].paso = 1;

        await client.sendMessage(chat, `Hola buen día!
Agradecemos su interés en Aleaia Swim Escuela de Natación✨☺️🏊🏻‍♂️

Impartimos clases de natación y aquarobics🏊🏻‍♂️🏊🏻‍♀️✨ 3 años 5 meses en adelante✨

✅ Maestros expertos y 100% capacitados
✅ Alberca con calefacción
✅ Grupos pequeños para atención personalizada
✅ Instalaciones privadas y entorno seguro.
✅ Horarios flexibles que se adaptan a ti

Le compartimos nuestros horarios actuales:`);

        const horarios = MessageMedia.fromFilePath('./horarios.jpg');
        await client.sendMessage(chat, horarios);

        await client.sendMessage(chat, `Así como nuestros costos por clases que desee tomar al mes:`);

        const precios = MessageMedia.fromFilePath('./precios.jpg');
        await client.sendMessage(chat, precios);

        await client.sendMessage(chat, `Contamos con el sistema de HORARIOS FLEXIBLES, los alumnos reservan sus horarios por medio de nuestra pagina web💻

📍 Nos ubicamos en Avenida Primero de mayo 1607 colonia Los Mangos, pasando el Tec de Madero.

El material de clase es brindado por la escuela y como requisitos se solicita traer:
• Traje de baño o ropa de lycra
• Gorro de natación (costo $200)
• Goggles de natación

¿Cuántas clases quisiera tomar a la semana?🏊🏻‍♂️🏊🏻‍♀️✨`);

        return;
    }

    // 🔥 DETECTAR CLASES
    if (estados[chat].paso === 1) {

        let numero = null;

        if (texto.includes('1') || texto.includes('una')) numero = 4;
        if (texto.includes('2') || texto.includes('dos')) numero = 8;
        if (texto.includes('3') || texto.includes('tres')) numero = 12;
        if (texto.includes('4') || texto.includes('cuatro')) numero = 16;

        if (numero) {
            estados[chat].paso = 2;

            let costo = {
                4: '$600',
                8: '$850',
                12: '$1350',
                16: '$1550'
            };

            await client.sendMessage(chat, `Su paquete seria el de ${numero} clases, el paquete tiene un costo de ${costo[numero]} y la inscripción 550🏊🏻‍♂️🏊🏻‍♀️`);

            await client.sendMessage(chat, `Le proporcionamos los datos de la tarjeta a la cual puede realizar su depósito o transferencia 👍🏻`);

            const banco = MessageMedia.fromFilePath('./banco.jpg');
            await client.sendMessage(chat, banco);

            await client.sendMessage(chat, `Una vez hecha la transferencia o deposito favor de enviar su comprobante para el apartado de su lugar😊una vez realizado el pago no hay reembolso, sin excepcion.`);

        }

        return;
    }

    // 🔥 DETECTAR COMPROBANTE
    if (estados[chat].paso === 2 && msg.hasMedia) {
        estados[chat].paso = 3;

        await client.sendMessage(chat, `Nos podría proporcionar la siguiente información del alumno(a) porfavor, es para el registro✨🙌🏻
- nombre completo 
- edad y fecha de nacimiento
- padece o padeció alguna discapacidad y/o actualmente tiene alguna enfermedad?

Le enviamos el link para el registro de usuario en la página web de nuestra escuela☺️✨

https://aleaiaswim.com/register/

Después de llenar el formulario de usuario le enviarán un correo de Aleaia Swim (puede llegar a spam) hay que dar clic en el link que contiene dicho correo para verificar su correo 😊

Una vez que verifique su correo favor de notificarnos para proceder a activarle su membresía`);

        return;
    }

    // 🔥 DETECTAR DATOS
    if (
        texto.includes('nombre') ||
        texto.includes('edad') ||
        texto.includes('nacimiento')
    ) {
        estados[chat].datos = true;
    }

    // 🔥 DETECTAR REGISTRO LISTO
    if (
        texto.includes('listo') ||
        texto.includes('ya') ||
        texto.includes('registr') ||
        texto.includes('verifi')
    ) {

        if (!estados[chat].datos) {
            await client.sendMessage(chat, `Nos podría proporcionar la siguiente información del alumno(a) porfavor, es para el registro✨🙌🏻
- nombre completo 
- edad y fecha de nacimiento
- padece o padeció alguna discapacidad y/o actualmente tiene alguna enfermedad?`);
            return;
        }

        estados[chat].paso = 4;

        await client.sendMessage(chat, `Recibidos datos de registro:)

Para reservar🏊🏻‍♀️✨:
En nuestra página ALEAIASWIM.COM
- Ingresa con su usuario en el apartado INICIAR SESIÓN 
- Da clic en el icono de 3 rayas horizontales y posteriormente en el apartado HORARIOS
- Se aperturaran los horarios disponibles de la semana 
- selecciona el horario que desee reservar para clase dando clic en el cuadrito azul de dicha clase
- confirma su reserva 
- Le aparecerá un recuadro confirmando su clase reservada☺️✨

Y listo ✅ habrá quedado su clase reservada correctamente☺️✨

Para cancelar su clase con opción a reposición siempre y cuando sea con al menos dos horas previas a la clase☺️

- Se va a la sección de “Mis Clases” 
- Selecciona el día donde haya reservado su clase 
- Se desplegará y aparecerá su clase reservada y alado un bote de basura en un recuadro azul 
- da clic en el 
- confirma su cancelación 

Y listo ✅ habrá quedado su clase cancelada correctamente☺️✨y le será abonada a su conteo de clases total

Las clases se habilitan 48 horas antes☝🏻

Hoy, le aparecen todo el dia de hoy y de mañana, y pasado mañana se van abriendo las horas conforme van pasando el dia 🙆🏻‍♀️ por ejemplo:

hoy a las 8 am se habilita la clase del miércoles 8 am
a las 9 am, la del miercoles 9 am y asi sucesivamente :)

Le recomendamos lo siguiente para agendar sus clases :

🏊🏻‍♀️🏊🏻‍♂️Ponga alarma a la hora que se abre la clase que le gustaría agendar 
🏊🏻‍♀️🏊🏻‍♂️Si la clase está llena, siga revisando la página ya que algunos alumnos cancelan (recuerde el tiempo de cancelación es 2 horas antes)
🏊🏻‍♀️🏊🏻‍♂️Cada que entre a revisar la página, favor de actualizarla

Le enviamos la invitacion:

Al grupo oficial donde se comparten avisos oficiales de la escuela, favor de ingresar🙌🏻

https://chat.whatsapp.com/FhN33scLMEUIFpgCURJPjQ?mode=gi_t

Bienvenido a Aleaia Swim Escuela de Natación!🏊🏻‍♀️✨cualquier duda que tenga puede hacérnoslo saber por este medio y le responderemos a la brevedad posible☺️`);

    }

    // 🔥 ERROR VERIFICACIÓN
    if (texto.includes('no puedo') || texto.includes('no deja')) {
        await client.sendMessage(chat, `No se preocupe lo verificamos manualmente por usted`);
    }

});

client.initialize();
