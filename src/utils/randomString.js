const charlist = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z',
];

const randomString = (numOfChar) => {
  let filestring = '';
  for (let i = 0; i < numOfChar; i += 1) {
    const charLoc = Math.floor(Math.random() * charlist.length);
    const newChar = charlist[charLoc];
    filestring += newChar;
  }
  return filestring;
};

export default randomString;
