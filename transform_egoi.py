#!/usr/bin/env python3
"""
Script to download and transform EGOI 2024 teamcoding test data
Transforms:
- Remove k from first line (only keep n)
- Add 1 to all language values (p[i] + 1)
- Add 1 to all parent values (parent + 1)
"""

import urllib.request
import sys

# All files organized by group
FILES = {
    'group1': [
        '001-singleton.in', '002-path-1.in', '003-path-2.in', '004-path-3.in',
        '005-path-4.in', '006-path-5.in', '007-path-6.in', '008-path-7.in',
        '009-path-8.in', '010-path-bip-small.in', '011-path-bip-mid.in',
        '012-path-bip-long.in', '013-path-col-small.in', '014-path-col-mid.in',
        '015-path-col-long.in', '1.in'
    ],
    'group2': [
        '001-singleton.in', '002-path-1.in', '010-path-bip-small.in',
        '011-path-bip-mid.in', '012-path-bip-long.in', '016-depth-two-small.in',
        '017-depth-two-mid.in', '018-depth-two-large.in', '019-caterpillar-small.in',
        '020-caterpillar-mid.in', '021-caterpillar-large.in', '022-almost_star_bip.in',
        '023-bip-1.in', '024-bip-3.in', '025-bip-5.in', '026-bip-6.in',
        '027-bip-8.in', '028-bip-8-2.in', '029-bip-9.in', '030-bip-10.in',
        '031-bip-11.in', '2.in'
    ],
    'group3': [
        '001-singleton.in', '002-path-1.in', '003-path-2.in', '004-path-3.in',
        '005-path-4.in', '006-path-5.in', '007-path-6.in', '009-path-8.in',
        '013-path-col-small.in', '014-path-col-mid.in', '015-path-col-long.in',
        '023-bip-1.in', '032-sub3-1.in', '033-sub3-2.in', '034-sub3-3.in',
        '035-sub3-4.in', '036-sub3-5.in', '037-sub3-6.in', '038-sub3-7.in',
        '039-sub3-8.in', '040-sub3-9.in', '041-sub3-10.in', '042-long-almostpath.in',
        '043-three-paths-large.in', '044-three-paths-mid.in', '045-deeper-mid.in',
        '046-random-mid.in', '047-sub4-1.in', '048-sub5-2.in', '049-sub5-3.in',
        '050-sub5-4.in', '051-sub5-5.in', '052-sub5-6.in', '1.in', '2.in', '3.in', '4.in'
    ],
    'group4': [
        '001-singleton.in', '002-path-1.in', '003-path-2.in', '004-path-3.in',
        '005-path-4.in', '006-path-5.in', '007-path-6.in', '008-path-7.in',
        '010-path-bip-small.in', '011-path-bip-mid.in', '013-path-col-small.in',
        '014-path-col-mid.in', '016-depth-two-small.in', '017-depth-two-mid.in',
        '019-caterpillar-small.in', '020-caterpillar-mid.in', '023-bip-1.in',
        '024-bip-3.in', '027-bip-8.in', '028-bip-8-2.in', '032-sub3-1.in',
        '033-sub3-2.in', '034-sub3-3.in', '035-sub3-4.in', '036-sub3-5.in',
        '044-three-paths-mid.in', '045-deeper-mid.in', '046-random-mid.in',
        '047-sub4-1.in', '053-caterpillar-col-mid.in', '054-sqrt-paths-mid.in',
        '055-many-mid.in', '056-tie-mid.in', '057-reg-mid-1.in', '058-reg-mid-2.in',
        '059-shallow-mid.in', '060-bib-med.in', '1.in', '2.in', '3.in', '4.in'
    ],
    'group5': [
        '001-singleton.in', '002-path-1.in', '003-path-2.in', '004-path-3.in',
        '005-path-4.in', '006-path-5.in', '007-path-6.in', '008-path-7.in',
        '009-path-8.in', '010-path-bip-small.in', '011-path-bip-mid.in',
        '012-path-bip-long.in', '013-path-col-small.in', '014-path-col-mid.in',
        '015-path-col-long.in', '016-depth-two-small.in', '017-depth-two-mid.in',
        '018-depth-two-large.in', '019-caterpillar-small.in', '020-caterpillar-mid.in',
        '021-caterpillar-large.in', '022-almost_star_bip.in', '023-bip-1.in',
        '024-bip-3.in', '025-bip-5.in', '026-bip-6.in', '027-bip-8.in',
        '028-bip-8-2.in', '029-bip-9.in', '030-bip-10.in', '031-bip-11.in',
        '032-sub3-1.in', '033-sub3-2.in', '034-sub3-3.in', '035-sub3-4.in',
        '036-sub3-5.in', '037-sub3-6.in', '038-sub3-7.in', '039-sub3-8.in',
        '040-sub3-9.in', '041-sub3-10.in', '042-long-almostpath.in',
        '043-three-paths-large.in', '044-three-paths-mid.in', '045-deeper-mid.in',
        '046-random-mid.in', '047-sub4-1.in', '048-sub5-2.in', '049-sub5-3.in',
        '050-sub5-4.in', '051-sub5-5.in', '052-sub5-6.in', '053-caterpillar-col-mid.in',
        '054-sqrt-paths-mid.in', '055-many-mid.in', '056-tie-mid.in',
        '057-reg-mid-1.in', '058-reg-mid-2.in', '059-shallow-mid.in',
        '060-bib-med.in', '061-caterpillar-col-long.in', '062-sqrt-paths-large.in',
        '063-sub5-7.in', '064-bib5-1.in', '065-bib5-2.in', '066-reg5-1.in',
        '067-reg5-2.in', '068-reg5-3.in', '069-reg5-4.in', '070-reg5-5.in',
        '071-reg5-6.in', '072-reg5-7.in', '073-reg5-8.in', '074-reg5-9.in',
        '075-reg5-10.in', '076-large-many1.in', '077-large-many2.in',
        '078-large-tie.in', '1.in', '2.in', '3.in', '4.in'
    ]
}

BASE_URL = "https://raw.githubusercontent.com/zehnsechs/egoi-2024-testdata/main/day1/teamcoding/data/secret"


def transform_input(content):
    """Transform input according to requirements:
    - Remove k from first line
    - Add 1 to all language values
    - Add 1 to all parent values
    """
    # Check if it's a symlink
    if content.startswith('../'):
        return None  # Skip symlinks

    lines = content.strip().split('\n')

    if len(lines) < 2:
        return None  # Invalid format

    # Line 1: n k -> n
    first_line = lines[0].split()
    if len(first_line) < 2:
        return None
    n = first_line[0]

    # Line 2: language preferences (add 1 to each)
    languages = [str(int(x) + 1) for x in lines[1].split()]

    # Lines 3+: parent values (add 1 to each)
    # For singleton (n=1), there are no parent lines
    parents = []
    if len(lines) > 2:
        parents = [str(int(line.strip()) + 1) for line in lines[2:]]

    # Build new content
    result = [n]
    result.append(' '.join(languages))
    result.extend(parents)

    return '\n'.join(result) + '\n'


def download_and_transform(group, filename):
    """Download a file and transform it"""
    url = f"{BASE_URL}/{group}/{filename}"
    output_path = f"day1/teamcoding/data/secret/{group}/{filename}"

    try:
        with urllib.request.urlopen(url) as response:
            content = response.read().decode('utf-8')

        # Transform the content
        transformed = transform_input(content)

        # Skip symlinks
        if transformed is None:
            print(f"⊘ {group}/{filename} (symlink/invalid)")
            return True  # Count as success but skip

        # Write to file
        with open(output_path, 'w') as f:
            f.write(transformed)

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
            if download_and_transform(group, filename):
                success += 1

    print(f"\n{'='*50}")
    print(f"Completed: {success}/{total} files")
    print(f"Failed: {total - success} files")

    return 0 if success == total else 1


if __name__ == '__main__':
    sys.exit(main())
