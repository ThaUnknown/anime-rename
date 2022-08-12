import Bottleneck from 'bottleneck'

const limiter = new Bottleneck({ minTime: 600 })

async function alRequest ({ name }) {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      variables: {
        name
      },
      query: /* js */`
query($name: String) {
  Page(page: 1, perPage: 3) {
    media(search: $name) {
      title {
        romaji,
        english
      }
    }
  }
}`
    })
  })
  if (!res.ok && res.status === 429) return await limited({ name })
  let json = null
  try {
    json = await res.json()
  } catch (e) {
    console.error('Error in parsing JSON from request!', e)
  }
  if (!res.ok && json) {
    console.error('Error in making request!', json.errors)
  }
  return json
}

const limited = limiter.wrap(alRequest)

export default limited
