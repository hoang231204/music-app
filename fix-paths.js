const fs = require('fs');
const path = require('path');

function replaceInDir(dir, findRegex, replaceStr) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, findRegex, replaceStr);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (findRegex.test(content)) {
        content = content.replace(findRegex, replaceStr);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'api/v1/controllers'), /from "\.\.\/\.\.\/\.\.\/helpers/g, 'from "../../../../helpers');
replaceInDir(path.join(__dirname, 'api/v1/middlewares'), /from '\.\.\/\.\.\/\.\.\/helpers/g, "from '../../../../helpers");
replaceInDir(path.join(__dirname, 'api/v1/models'), /from "\.\.\/\.\.\/helpers/g, 'from "../../../helpers');

console.log('Done fixing paths again');
