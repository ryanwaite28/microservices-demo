const express = require('express');
const path = require('path');



const app = express();
app.use(express.json());

const static_path = path.join(__dirname, 'public');
console.log(`static_path:`, static_path);
const static_middlewhere = express.static(static_path, { index: ['index.html'] });
app.use(static_middlewhere);

const pages_map = {
  root: `${static_path}/static/index.html`,
};




app.get(`/`, (request, response) => {
  return response.sendFile(pages_map.root);
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${process.env.APP_NAME || 'FRONT_END'}:${process.pid} Server listening on port ${PORT}...`);
});
