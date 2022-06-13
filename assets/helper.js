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

  output = [];
  
  newOutput.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<span class="quote">');

      output.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(gt => {
        let body = gt.split('</span>');

        output.push({
          type: 'green-text',
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
      output.push(obj);
  });

  newOutput = [];
  
  output.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<i>');

      newOutput.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(it => {
        let body = it.split('</i>');

        newOutput.push({
          type: 'italic-text',
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
    newOutput.push(obj);
  });
  
  output = [];
  
  newOutput.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<s>');

      output.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(spoiler => {
        let body = spoiler.split('</s>');

        output.push({
          type: 'spoiler-text',
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
      output.push(obj);
  });

  newOutput = [];
  
  output.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<b><u>');

      newOutput.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(it => {
        let body = it.split('</u></b>');

        newOutput.push({
          type: 'bold-underline-text',
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
    newOutput.push(obj);
  });
  
  output = [];
  
  newOutput.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<u>');

      output.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(spoiler => {
        let body = spoiler.split('</u>');

        output.push({
          type: 'underline-text',
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
      output.push(obj);
  });

  newOutput = [];
  
  output.map(obj => {
    if(obj.type == 'text') {
      let arr = obj.text.split('<b>');

      newOutput.push({
        type: 'text',
        text: arr.shift(),
      });

      arr.map(it => {
        let body = it.split('</b>');

        newOutput.push({
          type: 'bold-text',
          text: body.shift(),
        }, {
          type: 'text',
          text: body.join(""),
        })
      });
    } else 
    newOutput.push(obj);
  });
  
  return output.filter(inp => inp.text != "");
};