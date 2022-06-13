export const replaceText = (text, ellipsis = text.length) => {
  text = text
    ?.replace(/&quot;/g,'"')
    .replace(/&#039;/g,'\'')
    .replace(/&amp;/g,'&')
    .replace(/&gt;/g,'>')
    .replace(/<wbr>|\[Embed]|\[Open]/g,'')

  return text?.substr(0, ellipsis).length < text?.length ?
    text?.substr(0, ellipsis).trim() + "..." :
    text
};

const replaceTagWithObject = (array, tag, endtag, name) => {
  var output = []
  array.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split(tag);

      output.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(string => {
        let body = string.split(endtag);

        output.push({
          type: name,
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
      output.push(obj);
  });
  return output;
}

export const splitText = (text) => {
  var input = [];

  text.split('<br>').map(inp => {
    input.push({
      type: 'text',
      text: inp,
    })
  });

  var output = [];

  input.map(inp => {
    let arr = inp.text.split('<a href="');
    output.push({
      type: 'text',
      text: arr.shift(),
    });
  
    arr.map(link => {
      let linkArr = link.split('">');
      let href = linkArr.shift();
      let body = linkArr.join('">').split('</a>');
      output.push({
        type: 'link',
        text: body.shift(),
        href: href,
      }, {
        type: 'text',
        text: body.join(""),
      });
    });
  
  })

  var newOutput = []

  output.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<span style="');

      newOutput.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(ctext => {
        let textArr = ctext.split('">');
        let style = textArr.shift();
        let body = textArr.join('">').split('</span>');

        var styleObj = {};
        style.split(';').map(style => {
          let sp = style.split(':')[0].split('-');
          let sv = style.split(':')[1];
          if(style.split(':')[0] == sp) {styleObj[sp] = sv}
          else styleObj[sp[0] + sp[1]?.substr(0,1)?.toUpperCase() + sp[1]?.substr(1)] = sv;
        });

        newOutput.push({
          type: 'custom-text',
          text: body.shift(),
          style: styleObj,
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
      newOutput.push(obj);
  });

  newOutput = replaceTagWithObject(newOutput, '<span class="quote">', '</span>', 'green-text');
  newOutput = replaceTagWithObject(newOutput, '<i>', '</i>', 'italic-text');
  newOutput = replaceTagWithObject(newOutput, '<s>', '</s>', 'spoiler-text');
  newOutput = replaceTagWithObject(newOutput, '<b><u>', '</u></b>', 'bold-underline-text');
  newOutput = replaceTagWithObject(newOutput, '<b>', '</b>', 'bold-text');
  newOutput = replaceTagWithObject(newOutput, '<u>', '</u>', 'underline-text');
  
  return newOutput.filter(inp => inp.text != "");
};