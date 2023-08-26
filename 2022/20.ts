import { getInput } from '../lib/aoc'

const SAMPLE_INPUT = `1
2
-3
3
-2
0
4`

type ListNode<T> = {
  value: T
  previous: ListNode<T>
  next: ListNode<T>
}

function traverse<T>(node: ListNode<T>, offset: number) {
  let element = node

  for (let i = 0; i < offset; i++) {
    element = element.next
  }

  return element
}

function createList<T>(inputArray: T[]) {
  return inputArray.map(value => ({ value }) as any)
    .map((node, index, array) => {
      node.previous = array[(index - 1 + array.length) % array.length]
      node.next = array[(index + 1) % array.length]

      return node as ListNode<T>
    })
}

function parseInput(input: string) {
  return input.trim().split("\n").map(value => parseInt(value))
}

function mix(listItems: ListNode<number>[]) {
  for (const node of listItems) {
    if (node.value === 0) {
      continue
    }

    let offset = node.value % (listItems.length - 1)
    if (offset < 0) {
      offset += listItems.length - 1
    }

    // remove node from list
    node.previous.next = node.next
    node.next.previous = node.previous

    const insertNode = traverse(node, offset)

    // insert at new position
    node.previous = insertNode
    node.next = insertNode.next
    node.next.previous = node
    node.previous.next = node

  }
}

function part1(input: string) {
  const data = parseInput(input)
  const listItems = createList(data)

  mix(listItems)

  const zero = listItems.find(n => n.value === 0)!

  return traverse(zero!, 1000).value +
    traverse(zero!, 2000).value +
    traverse(zero!, 3000).value
}

function part2(input: string) {
  const data = parseInput(input)
  const listItems = createList(data.map(v => v * 811589153))

  for (let i = 0; i < 10; i++) {
    mix(listItems)
  }

  const zero = listItems.find(n => n.value === 0)!

  return traverse(zero!, 1000).value +
    traverse(zero!, 2000).value +
    traverse(zero!, 3000).value
}

// console.log(part1(SAMPLE_INPUT))
console.log(part2(await getInput(20, 2022)))


