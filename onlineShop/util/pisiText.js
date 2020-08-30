const fs = require('fs');
const pisiText = (txt1, txt2, txt3, txt4) => {
  // Get the file contents before the append operation
  // console.log(
  //   '\nFile Contents of xxx file before append:',
  //   fs.readFileSync(`${__dirname}/protok.txt`, 'utf8')
  // );
  // if (!txt2) {
  //   txt2 = '';
  // }
  if (!txt3) {
    txt3 = '';
  }
  if (!txt4) {
    txt4 = '';
  }
  let textdata = `${txt1}= ${txt2} ;${txt3} ;${txt4}`;
  fs.appendFile(`${__dirname}/pisiText.txt`, '\n' + textdata, (err) => {
    if (err) {
      console.log(err);
    } 
    // else {
    //   // Get the file contents after the append operation
    //   // console.log(
    //   //   '\nFile Contents of file after append:',
    //   //   fs.readFileSync(`${__dirname}/pisiText.txt`, 'utf8')
    //   // );
    //   console.log(
    //     '\nFile Contents of file after append:',
    //     fs.readFileSync(`${__dirname}/pisiText.txt`, 'utf8')
    //   );
    // }
  });
};

exports.pisiText = pisiText;
