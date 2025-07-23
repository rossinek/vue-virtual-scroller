// CUSTOMIZED: with additional ion-content support
// Fork of https://github.com/olahol/scrollparent.js to be able to build with Rollup

const regex = /auto|scroll/

async function parents(node, ps) {
  if (node.tagName === 'ION-CONTENT') {
    ps = ps.concat([await node.getScrollElement()])
  }

  if (node.parentNode === null) {
    return ps
  }

  return parents(node.parentNode, ps.concat([node]))
}

function style(node, prop) {
  return getComputedStyle(node, null).getPropertyValue(prop)
}

function overflow(node) {
  return style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x')
}

function scroll(node) {
  return regex.test(overflow(node))
}

export async function getScrollParent(node) {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return
  }

  const ps = await parents(node.parentNode, [])

  for (let i = 0; i < ps.length; i += 1) {
    if (scroll(ps[i])) {
      return ps[i]
    }
  }

  return document.scrollingElement || document.documentElement
}
