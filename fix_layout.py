import re

layouts = {
    'pomodoro.html': {
        'index': 'index.html',
        'blog': 'blog/index.html',
        'lang': 'EN',
        'lang_link': 'pomodoro_en.html'
    },
    'pomodoro_en.html': {
        'index': 'index_en.html',
        'blog': 'blog/index_en.html',
        'lang': 'KO',
        'lang_link': 'pomodoro.html'
    },
    'password.html': {
        'index': 'index.html',
        'blog': 'blog/index.html',
        'lang': 'EN',
        'lang_link': 'password_en.html'
    },
    'password_en.html': {
        'index': 'index_en.html',
        'blog': 'blog/index_en.html',
        'lang': 'KO',
        'lang_link': 'password.html'
    }
}

for file, data in layouts.items():
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace body class
    body_pattern = r'<body class="([^"]*)">'
    new_body = '<body class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-gray-300 transition-colors duration-300">'
    content = re.sub(body_pattern, new_body, content)

    # Replace header
    header_pattern = r'<header.*?</header>'
    
    new_header = f'''    <!-- Header -->
    <header class="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
        <div class="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 transition-colors">
            <h1 class="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                <a href="{data['index']}" class="flex items-center gap-1">
                    <span class="text-indigo-600 dark:text-indigo-400">Daily</span> Pick Lab
                </a>
            </h1>
            <div class="flex items-center gap-2">
                <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400" aria-label="Toggle Dark Mode">
                   🌓
                </button>
                <a href="about.html" class="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hidden sm:block">About</a>
                <a href="{data['blog']}" class="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hidden sm:block">Blog</a>
                <a href="{data['index']}" class="text-xs font-bold text-gray-500 hover:text-indigo-600 border border-gray-200 px-2 py-1 rounded">🏠 Home</a>
                <a href="{data['lang_link']}" class="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 transition">
                    {data['lang']}
                </a>
            </div>
        </div>
    </header>'''

    content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)

    # Replace <main ...> attributes to match
    main_pattern = r'<main class="([^"]*)">'
    new_main = '<main class="max-w-2xl mx-auto px-4 py-6">'
    content = re.sub(main_pattern, new_main, content)

    # Insert Ad Slot right after <main...> if not present
    ad_slot = '''
        <!-- Ad Slot -->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2678965337292925"
             crossorigin="anonymous"></script>
        <!-- 광고1 -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-2678965337292925"
             data-ad-slot="4274417070"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
'''
    if 'adsbygoogle.js' not in content:
        content = content.replace('<main class="max-w-2xl mx-auto px-4 py-6">', '<main class="max-w-2xl mx-auto px-4 py-6">' + ad_slot)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'Updated {file}')
