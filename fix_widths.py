import glob
import re

files = glob.glob('*.html') + glob.glob('blog/*.html')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    def repl(match):
        cls = match.group(1)
        # Add max-w-none if it's a prose article and doesn't already have it
        if 'prose' in cls and 'max-w-none' not in cls:
            # specifically insert it to ensure it overrides defaults
            return f'<article class="{cls} max-w-none">'
        return match.group(0)

    new_content = re.sub(r'<article class="([^"]+)">', repl, content)
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed {f}")
        count += 1

print(f"Total files updated: {count}")
