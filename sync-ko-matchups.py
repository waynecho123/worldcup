#!/usr/bin/env python3
"""
Sync discovered KO matchups back into source files.
Reads ko-matchups.json (written by updateMatchDetails when it finds teams via partial match)
and updates:
  1. update-scores.js  — getMatchSchedule()
  2. index.html        — MATCH_SCHEDULE
  3. mini-program-worldcup/utils/data.js — MATCH_SCHEDULE
"""
import json, re, sys, os

BASE = os.path.dirname(os.path.abspath(__file__))
KO_FILE = os.path.join(BASE, 'ko-matchups.json')

if not os.path.exists(KO_FILE):
    print('No ko-matchups.json, nothing to sync')
    sys.exit(0)

with open(KO_FILE) as f:
    ko = json.load(f)

if not ko:
    print('ko-matchups.json is empty')
    sys.exit(0)

updated = []

for mid, teams in ko.items():
    home_id = teams['home']
    away_id = teams['away']
    
    # 1. Update update-scores.js getMatchSchedule
    js_file = os.path.join(BASE, 'update-scores.js')
    with open(js_file) as f:
        js = f.read()
    pattern = rf'{{id:"{mid}",home:"[^"]*",away:"[^"]*"}}'
    replacement = f'{{id:"{mid}",home:"{home_id}",away:"{away_id}"}}'
    new_js, n = re.subn(pattern, replacement, js)
    if n > 0:
        with open(js_file, 'w') as f:
            f.write(new_js)
        print(f'  update-scores.js: {mid} → {home_id} vs {away_id}')
    
    # 2. Update index.html MATCH_SCHEDULE
    html_file = os.path.join(BASE, 'index.html')
    with open(html_file) as f:
        html = f.read()
    pattern = rf'{{id:"{mid}",date:"[^"]*",time:"[^"]*",home:"[^"]*",away:"[^"]*"'
    replacement = f'{{id:"{mid}",date:"\\1",time:"\\2",home:"{home_id}",away:"{away_id}"'
    # More targeted: match the exact entry
    pattern2 = rf'({{id:"{mid}",date:"[^"]*",time:"[^"]*",)home:"[^"]*",away:"[^"]*"(,grp:"[^"]*",stage:"[^"]*",venue:"[^"]*"}})'
    def fix_html(m):
        return f'{m.group(1)}home:"{home_id}",away:"{away_id}"{m.group(2)}'
    new_html, n2 = re.subn(pattern2, fix_html, html)
    if n2 > 0:
        with open(html_file, 'w') as f:
            f.write(new_html)
        print(f'  index.html: {mid} → {home_id} vs {away_id}')
    
    # 3. Update mini-program data.js
    data_file = os.path.join(BASE, 'mini-program-worldcup', 'utils', 'data.js')
    with open(data_file) as f:
        djs = f.read()
    new_djs, n3 = re.subn(pattern2, fix_html, djs)
    if n3 > 0:
        with open(data_file, 'w') as f:
            f.write(new_djs)
        print(f'  data.js: {mid} → {home_id} vs {away_id}')
    
    if n + n2 + n3 > 0:
        updated.append(mid)

if updated:
    print(f'\nSynced {len(updated)} KO matchups: {", ".join(updated)}')
else:
    print('No updates needed (all matchups already in sync)')
