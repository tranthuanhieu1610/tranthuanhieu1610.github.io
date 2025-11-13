# SAT Question Format Guide

This guide explains how admins should format SAT questions using our custom Markdown syntax.

## Overview

All questions are written in Markdown with custom syntax blocks. The format supports:
- Multiple question types (Reading, Writing, Math)
- LaTeX math equations
- Images
- Passages for Reading/Writing questions
- Detailed explanations

## Basic Structure

Every question consists of:
1. **Metadata** (YAML frontmatter)
2. **Passage** (optional, for Reading/Writing)
3. **Question**
4. **Options** (A, B, C, D)
5. **Correct Answer**
6. **Explanation**

## Complete Example

```markdown
---
type: math_calc
difficulty: medium
tags: [algebra, linear-equations, word-problems]
desmos: true
source: Official SAT Practice Test 1, Question 15
---

::passage
A car rental company charges a flat fee of $25 plus $0.15 per mile driven.
Sarah rented a car and paid a total of $52.
::

::question
How many miles did Sarah drive the rental car?
::

::options
A) 150 miles
B) 180 miles
C) 200 miles
D) 250 miles
::

::answer
B
::

::explanation
Let $m$ represent the number of miles driven.

The total cost equation is:
$$25 + 0.15m = 52$$

Subtract 25 from both sides:
$$0.15m = 27$$

Divide both sides by 0.15:
$$m = \frac{27}{0.15} = 180$$

Therefore, Sarah drove **180 miles**.
::
```

## Metadata Fields

The YAML frontmatter at the top defines question metadata:

```yaml
---
type: reading | writing | math_no_calc | math_calc
difficulty: easy | medium | hard
tags: [tag1, tag2, tag3]
desmos: true | false
source: Official SAT Practice Test 1
---
```

### Field Descriptions

- **type**: Question section
  - `reading` - Reading and Writing: Reading passages
  - `writing` - Reading and Writing: Grammar/language
  - `math_no_calc` - Math section without calculator
  - `math_calc` - Math section with calculator allowed

- **difficulty**: Question difficulty level
  - `easy` - Basic concepts, straightforward
  - `medium` - Moderate complexity
  - `hard` - Advanced concepts, multi-step

- **tags**: Array of topic tags for filtering
  - Use lowercase, dash-separated
  - Examples: `algebra`, `linear-equations`, `quadratic-functions`

- **desmos**: Whether Desmos calculator is helpful
  - `true` - Calculator recommended
  - `false` - No calculator needed

- **source**: Where the question came from
  - Official tests: "Official SAT Practice Test [number]"
  - Other sources: Be specific

## Custom Syntax Blocks

### Passage Block (Optional)

Use for Reading/Writing questions that reference a text:

```markdown
:::passage
[Your passage text here]

Can include multiple paragraphs.

**Bold** and *italic* formatting supported.
:::
```

### Question Block (Required)

The actual question being asked:

```markdown
::question
What is the value of $x$ in the equation $3x + 5 = 20$?
::
```

### Options Block (Required)

Four answer choices, labeled A through D:

```markdown
::options
A) $x = 3$
B) $x = 5$
C) $x = 7$
D) $x = 15$
::
```

**Important**:
- Always use exactly 4 options
- Label as A), B), C), D) (with parenthesis and space)
- Each option on a new line

### Answer Block (Required)

The correct answer letter:

```markdown
::answer
B
::
```

Just the letter, no parenthesis or explanation.

### Explanation Block (Required)

Detailed explanation of how to solve:

```markdown
::explanation
Start by subtracting 5 from both sides:
$$3x = 15$$

Then divide by 3:
$$x = 5$$

Therefore, the answer is **B**.
::
```

## LaTeX Math Syntax

### Inline Math

Use single dollar signs for inline equations:

```markdown
The equation $x^2 + y^2 = r^2$ represents a circle.
```

### Display Math

Use double dollar signs for centered equations:

```markdown
$$\frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
```

### Common LaTeX Commands

```latex
# Fractions
$\frac{1}{2}$

# Exponents
$x^2$ or $x^{10}$

# Subscripts
$x_1$ or $x_{10}$

# Square roots
$\sqrt{x}$ or $\sqrt[3]{x}$

# Greek letters
$\alpha$, $\beta$, $\gamma$, $\theta$, $\pi$

# Operators
$\times$, $\div$, $\pm$, $\leq$, $\geq$, $\neq$

# Functions
$\sin(x)$, $\cos(x)$, $\tan(x)$, $\log(x)$
```

## Images

Include images using standard Markdown:

```markdown
![Graph showing linear function](/images/questions/q123-graph.png)
```

**Guidelines**:
- Upload images to `/public/images/questions/`
- Use descriptive filenames: `q[id]-[description].png`
- Keep file sizes reasonable (< 500KB)
- Use PNG or JPG format

## Tables

For data-based questions:

```markdown
| Year | Population | Growth Rate |
|------|------------|-------------|
| 2020 | 1,000,000  | 2.5%       |
| 2021 | 1,025,000  | 2.5%       |
| 2022 | 1,050,625  | 2.5%       |
```

## Question Type Examples

### Reading Question

```markdown
---
type: reading
difficulty: medium
tags: [main-idea, inference]
desmos: false
source: Official SAT Practice Test 3
---

:::passage
The Industrial Revolution marked a major turning point in human history.
Beginning in Britain in the late 18th century, it transformed society from
an agrarian economy to one dominated by industry and manufacturing.

[Continue passage...]
:::

::question
The primary purpose of the passage is to:
::

::options
A) Describe the causes of industrialization in Britain
B) Explain the social impact of the Industrial Revolution
C) Introduce the historical significance of the Industrial Revolution
D) Compare agrarian and industrial economies
::

::answer
C
::

::explanation
The passage opens by stating the Industrial Revolution "marked a major turning
point in human history" and provides a brief overview of its timeline and impact.
This indicates the primary purpose is to **introduce its significance** (option C),
rather than going deep into causes (A), social impacts (B), or comparisons (D).
::
```

### Writing Question

```markdown
---
type: writing
difficulty: easy
tags: [grammar, subject-verb-agreement]
desmos: false
source: Official SAT Practice Test 2
---

::question
The committee **have** decided to postpone the meeting until next week.

Which of the following is the best replacement for the underlined portion?
::

::options
A) NO CHANGE
B) has
C) are
D) were
::

::answer
B
::

::explanation
"Committee" is a collective noun that takes a singular verb. The correct form
is "**has** decided," not "have decided."

While "committee" refers to multiple people, it functions as a single unit,
requiring the singular verb form "has."
::
```

### Math (No Calculator)

```markdown
---
type: math_no_calc
difficulty: hard
tags: [algebra, quadratic-equations]
desmos: false
source: Official SAT Practice Test 5
---

::question
If $x^2 - 6x + k = 0$ has exactly one solution, what is the value of $k$?
::

::options
A) $-9$
B) $0$
C) $3$
D) $9$
::

::answer
D
::

::explanation
A quadratic equation has exactly one solution when its discriminant equals zero.

For $ax^2 + bx + c = 0$, the discriminant is $b^2 - 4ac$.

In our equation: $a = 1$, $b = -6$, $c = k$

Set discriminant to zero:
$$(-6)^2 - 4(1)(k) = 0$$
$$36 - 4k = 0$$
$$4k = 36$$
$$k = 9$$

Therefore, $k = 9$.
::
```

### Math (Calculator Allowed)

```markdown
---
type: math_calc
difficulty: medium
tags: [statistics, mean, data-analysis]
desmos: true
source: Official SAT Practice Test 4
---

::question
The table below shows the number of hours 10 students spent studying for an exam.

| Student | Hours |
|---------|-------|
| 1       | 3     |
| 2       | 5     |
| 3       | 2     |
| 4       | 7     |
| 5       | 4     |
| 6       | 6     |
| 7       | 3     |
| 8       | 5     |
| 9       | 8     |
| 10      | 2     |

What is the mean number of hours studied?
::

::options
A) 4.0 hours
B) 4.5 hours
C) 5.0 hours
D) 5.5 hours
::

::answer
B
::

::explanation
To find the mean, add all values and divide by the count:

$$\text{Mean} = \frac{3+5+2+7+4+6+3+5+8+2}{10}$$

$$\text{Mean} = \frac{45}{10} = 4.5$$

The mean number of hours studied is **4.5 hours**.
::
```

## Best Practices

### DO:
✅ Use clear, concise language
✅ Include units in math problems (miles, dollars, etc.)
✅ Provide step-by-step explanations
✅ Use LaTeX for all mathematical expressions
✅ Test your markdown before submitting
✅ Include source attribution
✅ Use appropriate difficulty levels

### DON'T:
❌ Use vague or ambiguous wording
❌ Skip the explanation (it's required!)
❌ Use more or fewer than 4 options
❌ Forget to specify the correct answer
❌ Use plain text for equations (use LaTeX)
❌ Include personal opinions in explanations
❌ Create questions with multiple correct answers

## Common Tags

### Reading
- `main-idea`, `inference`, `detail`, `vocabulary`, `author-purpose`, `tone`, `structure`

### Writing
- `grammar`, `punctuation`, `subject-verb-agreement`, `verb-tense`, `pronoun-usage`,
  `sentence-structure`, `transitions`, `word-choice`

### Math (Algebra)
- `linear-equations`, `systems-of-equations`, `quadratic-equations`, `polynomials`,
  `rational-expressions`, `radicals`, `inequalities`, `absolute-value`

### Math (Geometry)
- `angles`, `triangles`, `circles`, `area`, `volume`, `coordinate-geometry`,
  `trigonometry`

### Math (Statistics)
- `mean`, `median`, `mode`, `range`, `probability`, `data-analysis`, `graphs`,
  `scatter-plots`, `linear-regression`

### Math (Advanced)
- `functions`, `exponential-functions`, `logarithms`, `complex-numbers`,
  `sequences`, `series`

## Validation

Before submitting, verify:
- [ ] Metadata is complete and correct
- [ ] Question is clear and grammatically correct
- [ ] Exactly 4 answer options
- [ ] Correct answer is specified
- [ ] Explanation is detailed and accurate
- [ ] LaTeX renders correctly
- [ ] Images load properly (if any)
- [ ] Tags are relevant and consistent

## Need Help?

If you're unsure about formatting:
1. Check existing questions in the database
2. Use the preview feature before saving
3. Contact the development team
4. Reference official SAT questions for style

---

**Happy question writing! Your contributions help students succeed on the SAT.** 🎓
