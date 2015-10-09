import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'
import {
  split,
  head,
  last,
  map,
  mapObj,
  compose,
  match,
  take,
  nth,
  isEmpty,
  groupBy,
  prop,
  toPairs,
  fromPairs,
  reverse,
  replace,
  omit,
} from 'ramda'
import urlencode from 'urlencode'

import decode from './decode'

const rootUrl = 'http://www.99comic.com'
const searchUrl = 'http://so.99comic.com'

export function searchComic(name) {
  let query = isEmpty(name) ? '' : `/?key=${urlencode(name, 'gbk')}`
  return fetch(searchUrl + query)
    .then(res => res.text())
    .then(html => {
      let toComics = map(div => {
        let el = div.children().first()
        let title = el.text()
        let coverImage = el.children().first().attr('src')
        let code = nth(1, /(\d+)$/.exec(el.attr('href')))
        return {code, title, coverImage}
      })
      let $ = cheerio.load(html)
      let comicDivs = []
      $('#rightmain2 div.dSHtm div').each((i, e) => comicDivs.push($(e)))
      return toComics(comicDivs)
    })
}

/**
  Fetch information of a comic book
  type Comic {
    title: String,
    volumns: [Volumn]
  }

  type Volumn {
    part: String,
    title: String,
    images: [String]
  }

*/
export function fetchComic(code) {
  let bookPath = `/comic/${code}`
  return fetch(rootUrl + bookPath)
    .then(res => res.text())
    .then(text => {
      let $ = cheerio.load(text)
      let [title, _] = split(' ', $('title').text())
      let coverImage = $('div.replc img').attr('src')
      let author = last(split('：', $('div.replo').text()))
      let description = replace(/编辑九九漫画整理/g, '', $('div.replv').text())
      let volUrls = []
      $('.vol .bl li a[target=_blank]').each((i, e) => {
        let volUrl = rootUrl + $(e).attr('href')
        volUrls.push(volUrl)
      })
      // Fetch all comic info asynchronizly
      return Promise.all(map(volUrl => fetchVolum(volUrl))(volUrls))
        .then(volumns => {
          let groupByPart = compose(
            map(([t, vs]) => ({title: t, volumns: reverse(map(omit(['part']), vs))})),
            reverse, // Reverse part
            toPairs,
            groupBy(prop('part'))
          )
          return groupByPart(volumns)
        })
        .then(parts => ({
          code,
          title,
          author,
          description,
          coverImage,
          parts
        }))
    })
}

function fetchVolum(volUrl) {
  let [_, index] = /s=(\d+)/.exec(volUrl)
  let prefix = index => index > 9 ? index : '0' + index
  let cdnUrl = `http://2.99comic.com:9393/dm${prefix(index)}`
  return fetch(volUrl)
    .then(res => res.text())
    .then(html => {
      let $ = cheerio.load(html)
      let [part, title] = take(2, split(' ', $('title').text()))
      let screens = compose(
        map(path => cdnUrl + path),
        split('|'),
        text => decode(text, 'zhangxoewrm'),
        head,
        match(/[zhangxoewrm]{100,}/g)
      )($('script').first().text())

      return {
        part,
        title,
        screens
      }
    })
}
