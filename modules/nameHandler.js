import alRequest from './anilist.js'

const folderRx = /(\((?!TV|\d{4}).+\))/

async function getMediaFromName ({ name, format }) {
  const json = await alRequest({ name })
  if (!json?.data?.Page?.media?.length) {
    console.warn('Couldn\'t find media for ', name)
    return name
  }
  if (json.data.Page.media.length > 1) console.warn('Got more than 1 result for ', name)
  if (!json.data.Page.media[0].title[format]) console.warn('Couldnt find ', format, ' title for ', name)
  return json.data.Page.media[0].title[format] || name
}

// format: 'romaji'|'english' case sensitve
export default async function getName (string, format) {
  const noParenthesis = string.replace(folderRx, '')
  return getMediaFromName({ name: noParenthesis, format })
}
