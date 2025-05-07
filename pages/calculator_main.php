<?php

// Shortcode for the calculator
function custom_calculator_shortcode() {
    ob_start(); 
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charSet="utf-8" data-next-head=""/>
        <meta name="viewport" content="width=device-width" data-next-head=""/>
        <link rel="preload" href="https://asmos.hi-it.com.ua/nextjs/_next/static/css/eec4aa47eb3f5f08.css" as="style"/>
        <link rel="stylesheet" href="https://asmos.hi-it.com.ua/nextjs/_next/static/css/eec4aa47eb3f5f08.css" data-n-g=""/>
        <noscript data-n-css=""></noscript>
        <script defer="" noModule="" src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/polyfills-42372ed130431b0a.js"></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/webpack-ea28696b697ed16b.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/framework-a4ddb9b21624b39b.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/main-69ede15f592b503d.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/pages/_app-9d9fd5b712312b54.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/pages/index-e80b1b2bd884e596.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/MDNukSdhzsokUUBgl2SvX/_buildManifest.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/MDNukSdhzsokUUBgl2SvX/_ssgManifest.js" defer=""></script>
    </head>
    <body>
        <div id="__next">
            <div class="flex flex-col h-screen bg-[#0C0E3A] text-white">
                <header class="flex flex-col items-center mt-4">
                    <h1 class="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
                    <div class="flex justify-center mt-4 space-x-2">
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-yellow-400 text-yellow-400">1</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">2</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">3</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">4</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">5</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">6</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">7</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">8</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">9</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">10</div>
                    </div>
                </header>
                <div class="flex-grow flex items-center justify-center">
                    <div class="grid grid-cols-2 gap-8 w-full max-w-4xl p-8">
                        <div><label class="block mb-2 text-xl">НАЗВА ОБ`ЄКТУ</label><input type="text" class="w-full p-3 rounded-lg bg-white text-black" placeholder="Деталі про об'єкт" value=""/></div>
                        <div><label class="block mb-2 text-xl">РОЗМІЩЕННЯ ОБ`ЄКТА</label><select class="w-full p-3 rounded-lg bg-white text-black"><option value="" selected="">Область</option><option value="Закарпатська">Закарпатська</option><option value="Львівська">Львівська</option><option value="Івано-Франківська">Івано-Франківська</option><option value="Київська">Київська</option><option value="Тернопільська">Тернопільська</option><option value="Одеська">Одеська</option></select></div>
                    </div>
                </div>
                <footer class="flex justify-between p-8">
                    <button class="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg">НАЗАД</button>
                    <button class="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg">ДАЛІ</button>
                </footer>
            </div>
        </div>
        <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}},"page":"/","query":{},"buildId":"MDNukSdhzsokUUBgl2SvX","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script>
    </body>
    </html>
    <?php
    return ob_get_clean();
}
add_shortcode('calculator_shortcode', 'custom_calculator_shortcode');

// Shortcode for the authorization page

function custom_authorization_shortcode() {
    ob_start(); 
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charSet="utf-8" data-next-head=""/>
        <meta name="viewport" content="width=device-width" data-next-head=""/>
        <link rel="preload" href="https://asmos.hi-it.com.ua/nextjs/_next/static/css/eec4aa47eb3f5f08.css" as="style"/>
        <link rel="stylesheet" href="https://asmos.hi-it.com.ua/nextjs/_next/static/css/eec4aa47eb3f5f08.css" data-n-g=""/>
        <noscript data-n-css=""></noscript>
        <script defer="" noModule="" src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/polyfills-42372ed130431b0a.js"></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/webpack-ea28696b697ed16b.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/framework-a4ddb9b21624b39b.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/main-69ede15f592b503d.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/pages/_app-9d9fd5b712312b54.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/pages/autorization-2f3253803b292654.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/MDNukSdhzsokUUBgl2SvX/_buildManifest.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/MDNukSdhzsokUUBgl2SvX/_ssgManifest.js" defer=""></script>
    </head>
    <body>
        <div id="__next">
            <div class="flex flex-col h-screen bg-[#0C0E3A] text-white">
                <header class="flex flex-col items-center mt-4">
                    <h1 class="text-3xl font-bold">АВТОРИЗАЦІЯ</h1>
                </header>
                <div class="flex-grow flex items-center justify-center">
                    <div class="grid grid-cols-1 gap-8 w-full max-w-4xl p-8">
                        <div><input type="email" class="w-full p-3 mb-4 rounded-lg bg-white text-black" placeholder="Логін" value=""/></div>
                        <div><input type="password" class="w-full p-3 mb-4 rounded-lg bg-white text-black" placeholder="Пароль" value=""/></div>
                        <div class="flex items-center mb-4"><input type="checkbox" class="mr-2"/><label class="text-sm">Я погоджуюсь з умовами</label></div>
                        <button class="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg">ВВІЙТИ</button>
                        <p class="mt-4 text-center underline cursor-pointer">ЗАРЕЄСТРУВАТИСЬ</p>
                    </div>
                </div>
                <footer class="flex justify-between p-8">
                    <button class="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg">ВИЙТИ</button>
                </footer>
            </div>
        </div>
        <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}},"page":"/autorization","query":{},"buildId":"MDNukSdhzsokUUBgl2SvX","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script>
    </body>
    </html>
    <?php
    return ob_get_clean();
}
add_shortcode('authorization_shortcode', 'custom_authorization_shortcode');


// Shortcode for the panel
function custom_panel_shortcode() {
    ob_start(); 
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charSet="utf-8" data-next-head=""/>
        <meta name="viewport" content="width=device-width" data-next-head=""/>
        <link rel="preload" href="https://asmos.hi-it.com.ua/nextjs/_next/static/css/eec4aa47eb3f5f08.css" as="style"/>
        <link rel="stylesheet" href="https://asmos.hi-it.com.ua/nextjs/_next/static/css/eec4aa47eb3f5f08.css" data-n-g=""/>
        <noscript data-n-css=""></noscript>
        <script defer="" noModule="" src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/polyfills-42372ed130431b0a.js"></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/webpack-ea28696b697ed16b.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/framework-a4ddb9b21624b39b.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/main-69ede15f592b503d.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/pages/_app-9d9fd5b712312b54.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/chunks/pages/panel-ce7e267e3dc59ebd.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/MDNukSdhzsokUUBgl2SvX/_buildManifest.js" defer=""></script>
        <script src="https://asmos.hi-it.com.ua/nextjs/_next/static/MDNukSdhzsokUUBgl2SvX/_ssgManifest.js" defer=""></script>
    </head>
    <body>
        <div id="__next">
            <div class="flex flex-col h-screen bg-[#0C0E3A] text-white">
                <header class="flex flex-col items-center mt-4">
                    <h1 class="text-3xl font-bold">КАЛЬКУЛЯТОР КРІПЛЕННЯ</h1>
                    <div class="flex justify-center mt-4 space-x-2">
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-yellow-400 text-yellow-400">1</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">2</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">3</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">4</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">5</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">6</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">7</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">8</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">9</div>
                        <div class="w-8 h-8 border-2 rounded-full flex items-center justify-center border-gray-400 text-gray-400">10</div>
                    </div>
                </header>
                <div class="flex-grow flex items-center justify-center">
                    <div class="grid grid-cols-2 gap-8 w-full max-w-4xl p-8">
                        <div><label class="block mb-2 text-xl">НАЗВА ОБ`ЄКТУ</label><input type="text" class="w-full p-3 rounded-lg bg-white text-black" placeholder="Деталі про об'єкт" value=""/></div>
                        <div><label class="block mb-2 text-xl">РОЗМІЩЕННЯ ОБ`ЄКТА</label><select class="w-full p-3 rounded-lg bg-white text-black"><option value="" selected="">Область</option><option value="Закарпатська">Закарпатська</option><option value="Львівська">Львівська</option><option value="Івано-Франківська">Івано-Франківська</option><option value="Київська">Київська</option><option value="Тернопільська">Тернопільська</option><option value="Одеська">Одеська</option></select></div>
                    </div>
                </div>
                <footer class="flex justify-between p-8">
                    <button class="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg">НАЗАД</button>
                    <button class="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg">ДАЛІ</button>
                </footer>
            </div>
        </div>
        <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}},"page":"/","query":{},"buildId":"MDNukSdhzsokUUBgl2SvX","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script>
    </body>
    </html>
    <?php
    return ob_get_clean();
}
add_shortcode('panel_shortcode', 'custom_panel_shortcode');
?>
