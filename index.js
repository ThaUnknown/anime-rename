import getName from './modules/nameHandler.js'
import { opendir, rename } from 'node:fs/promises'
import { join } from 'node:path'

const format = process.argv[2] || 'english'
const folder = process.argv[3] || './'

try {
  const dir = await opendir(folder)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const newName = await getName(dirent.name, format)
      if (newName !== dirent.name) {
        console.log('Renaming ', dirent.name, ' to ', newName)
        rename(join(dir.path, dirent.name), join(dir.path, newName))
      } else {
        console.log('Name hasn\'t changed for', dirent.name)
      }
    }
  }
} catch (err) {
  console.error(err)
}
