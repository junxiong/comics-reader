export const comics = [
  {
    id: null,
    code: 9924076,
    title: '血族',
    coverImage: 'http://pic.huo80.com/comicui/24078.JPG',
    description: '《血族》是改编自吉尔莫·德尔·托罗和Chuck Hogan联合出版的同名小说的漫画。'
  },
  {
    id: null,
    code: 9924078,
    title: '行尸走肉',
    coverImage: 'http://pic.huo80.com/upload/up201002/a013.jpg',
    description: '《行尸走肉》是一部美国恐怖电视系列剧。改编自同名漫画。'
  },
  {
    id: null,
    code: 9924079,
    title: '惊变28天',
    coverImage: 'http://img.99mh.com/upload/up201101/a047.jpg',
    description: '剑桥科研小组发现一种可以令传染者处于永久杀人状态的病毒。'
  }
]

export function searchComics(query) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(comics), 500)
  })
}

export function fetchComic(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let comic = find(propEq('id', id), comics)
      if (isNil(comic)) reject(new Error('Comic not found'))
      else resolve(comic)
    }, 300)
  })
}
