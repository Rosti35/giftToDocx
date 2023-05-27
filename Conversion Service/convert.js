const fs = require('fs');
const officegen = require('officegen');

let giftContent = `
// multiple choice with specified feedback for right and wrong answers
Who won the World Cup in 2022? {
  ~%-100%No one. The tournament was cancelled due to a pandemic. #Sorry, that's incorrect. The tournament wasn't cancelled.
  ~%-100%Germany #No, sorry. Germany didn't win in 2022.
  =%100%Brazil #Yes, that's correct! Brazil won the World Cup in 2022.
  ~%-100%Spain #No, sorry. Spain didn't win in 2022.
}

// true/false
The capital of Australia is Sydney. {
  =FALSE #Correct! The capital of Australia is actually Canberra.
  ~TRUE #Incorrect. The capital of Australia is Canberra, not Sydney.
}

// short answer
What's the chemical symbol for Gold? {
  =Au #Correct, Au is the chemical symbol for Gold.
}
`;

// Perform transformations
giftContent = giftContent.replace(/{/g, "").replace(/}/g, "").replace(/~/g, "WRONG: ").replace(/=/g, "ANSWER: ");
giftContent = giftContent.replace(/%(.*)%/g, "(points: $1) ");

let docx = officegen('docx');

docx.on('error', function(err) {
    console.log(err);
});

let pObj = docx.createP();

// Split content into lines
let lines = giftContent.split("\n");
for (let line of lines) {
    // Check if line is a comment
    if (line.trim().startsWith('//')) {
        pObj.addText(line, {italic: true}); // Add comment in italic
    } else {
        // Split line into normal text and comment
        let parts = line.split('#');
        pObj.addText(parts[0]);
        if (parts.length > 1) {
            pObj.addText(' #' + parts[1], {color: '888888'}); // Add comment in grey color
        }
    }
    pObj.addLineBreak();
}

let out = fs.createWriteStream('giftContent.docx');

out.on('error', function(err) {
    console.log(err);
});

docx.generate(out);