#!/usr/bin/env python3
"""
Script to download EGOI 2024 teamcoding answer files (.ans)
No transformation needed - just copy the original files
"""

import urllib.request
import sys

# All files organized by group (same as transform_egoi.py)
FILES = {
    'group1': [
        '001-singleton.ans', '002-path-1.ans', '003-path-2.ans', '004-path-3.ans',
        '005-path-4.ans', '006-path-5.ans', '007-path-6.ans', '008-path-7.ans',
        '009-path-8.ans', '010-path-bip-small.ans', '011-path-bip-mid.ans',
        '012-path-bip-long.ans', '013-path-col-small.ans', '014-path-col-mid.ans',
        '015-path-col-long.ans', '1.ans'
    ],
    'group2': [
        '001-singleton.ans', '002-path-1.ans', '010-path-bip-small.ans',
        '011-path-bip-mid.ans', '012-path-bip-long.ans', '016-depth-two-small.ans',
        '017-depth-two-mid.ans', '018-depth-two-large.ans', '019-caterpillar-small.ans',
        '020-caterpillar-mid.ans', '021-caterpillar-large.ans', '022-almost_star_bip.ans',
        '023-bip-1.ans', '024-bip-3.ans', '025-bip-5.ans', '026-bip-6.ans',
        '027-bip-8.ans', '028-bip-8-2.ans', '029-bip-9.ans', '030-bip-10.ans',
        '031-bip-11.ans', '2.ans'
    ],
    'group3': [
        '001-singleton.ans', '002-path-1.ans', '003-path-2.ans', '004-path-3.ans',
        '005-path-4.ans', '006-path-5.ans', '007-path-6.ans', '009-path-8.ans',
        '013-path-col-small.ans', '014-path-col-mid.ans', '015-path-col-long.ans',
        '023-bip-1.ans', '032-sub3-1.ans', '033-sub3-2.ans', '034-sub3-3.ans',
        '035-sub3-4.ans', '036-sub3-5.ans', '037-sub3-6.ans', '038-sub3-7.ans',
        '039-sub3-8.ans', '040-sub3-9.ans', '041-sub3-10.ans', '042-long-almostpath.ans',
        '043-three-paths-large.ans', '044-three-paths-mid.ans', '045-deeper-mid.ans',
        '046-random-mid.ans', '047-sub4-1.ans', '048-sub5-2.ans', '049-sub5-3.ans',
        '050-sub5-4.ans', '051-sub5-5.ans', '052-sub5-6.ans', '1.ans', '2.ans', '3.ans', '4.ans'
    ],
    'group4': [
        '001-singleton.ans', '002-path-1.ans', '003-path-2.ans', '004-path-3.ans',
        '005-path-4.ans', '006-path-5.ans', '007-path-6.ans', '008-path-7.ans',
        '010-path-bip-small.ans', '011-path-bip-mid.ans', '013-path-col-small.ans',
        '014-path-col-mid.ans', '016-depth-two-small.ans', '017-depth-two-mid.ans',
        '019-caterpillar-small.ans', '020-caterpillar-mid.ans', '023-bip-1.ans',
        '024-bip-3.ans', '027-bip-8.ans', '028-bip-8-2.ans', '032-sub3-1.ans',
        '033-sub3-2.ans', '034-sub3-3.ans', '035-sub3-4.ans', '036-sub3-5.ans',
        '044-three-paths-mid.ans', '045-deeper-mid.ans', '046-random-mid.ans',
        '047-sub4-1.ans', '053-caterpillar-col-mid.ans', '054-sqrt-paths-mid.ans',
        '055-many-mid.ans', '056-tie-mid.ans', '057-reg-mid-1.ans', '058-reg-mid-2.ans',
        '059-shallow-mid.ans', '060-bib-med.ans', '1.ans', '2.ans', '3.ans', '4.ans'
    ],
    'group5': [
        '001-singleton.ans', '002-path-1.ans', '003-path-2.ans', '004-path-3.ans',
        '005-path-4.ans', '006-path-5.ans', '007-path-6.ans', '008-path-7.ans',
        '009-path-8.ans', '010-path-bip-small.ans', '011-path-bip-mid.ans',
        '012-path-bip-long.ans', '013-path-col-small.ans', '014-path-col-mid.ans',
        '015-path-col-long.ans', '016-depth-two-small.ans', '017-depth-two-mid.ans',
        '018-depth-two-large.ans', '019-caterpillar-small.ans', '020-caterpillar-mid.ans',
        '021-caterpillar-large.ans', '022-almost_star_bip.ans', '023-bip-1.ans',
        '024-bip-3.ans', '025-bip-5.ans', '026-bip-6.ans', '027-bip-8.ans',
        '028-bip-8-2.ans', '029-bip-9.ans', '030-bip-10.ans', '031-bip-11.ans',
        '032-sub3-1.ans', '033-sub3-2.ans', '034-sub3-3.ans', '035-sub3-4.ans',
        '036-sub3-5.ans', '037-sub3-6.ans', '038-sub3-7.ans', '039-sub3-8.ans',
        '040-sub3-9.ans', '041-sub3-10.ans', '042-long-almostpath.ans',
        '043-three-paths-large.ans', '044-three-paths-mid.ans', '045-deeper-mid.ans',
        '046-random-mid.ans', '047-sub4-1.ans', '048-sub5-2.ans', '049-sub5-3.ans',
        '050-sub5-4.ans', '051-sub5-5.ans', '052-sub5-6.ans', '053-caterpillar-col-mid.ans',
        '054-sqrt-paths-mid.ans', '055-many-mid.ans', '056-tie-mid.ans',
        '057-reg-mid-1.ans', '058-reg-mid-2.ans', '059-shallow-mid.ans',
        '060-bib-med.ans', '061-caterpillar-col-long.ans', '062-sqrt-paths-large.ans',
        '063-sub5-7.ans', '064-bib5-1.ans', '065-bib5-2.ans', '066-reg5-1.ans',
        '067-reg5-2.ans', '068-reg5-3.ans', '069-reg5-4.ans', '070-reg5-5.ans',
        '071-reg5-6.ans', '072-reg5-7.ans', '073-reg5-8.ans', '074-reg5-9.ans',
        '075-reg5-10.ans', '076-large-many1.ans', '077-large-many2.ans',
        '078-large-tie.ans', '1.ans', '2.ans', '3.ans', '4.ans'
    ]
}

BASE_URL = "https://raw.githubusercontent.com/zehnsechs/egoi-2024-testdata/main/day1/teamcoding/data/secret"


def download_ans_file(group, filename):
    """Download an answer file without transformation"""
    url = f"{BASE_URL}/{group}/{filename}"
    output_path = f"day1/teamcoding/data/secret/{group}/{filename}"

    try:
        with urllib.request.urlopen(url) as response:
            content = response.read().decode('utf-8')

        # Check if it's a symlink
        if content.startswith('../'):
            print(f"⊘ {group}/{filename} (symlink)")
            return True  # Count as success but skip

        # Write to file (no transformation)
        with open(output_path, 'w') as f:
            f.write(content)

        print(f"✓ {group}/{filename}")
        return True
    except Exception as e:
        print(f"✗ {group}/{filename}: {e}", file=sys.stderr)
        return False


def main():
    total = 0
    success = 0

    for group, files in FILES.items():
        print(f"\n{group}:")
        for filename in files:
            total += 1
            if download_ans_file(group, filename):
                success += 1

    print(f"\n{'='*50}")
    print(f"Completed: {success}/{total} files")
    print(f"Failed: {total - success} files")

    return 0 if success == total else 1


if __name__ == '__main__':
    sys.exit(main())
