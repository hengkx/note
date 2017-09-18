import JSEncrypt from 'jsencrypt';


function encrypt(str) {
  const rsa = new JSEncrypt.JSEncrypt();
  rsa.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDwM2xWXTxblmLsUtr8Hg+pPsad
bEDH2XPbXaMCGzSGtZNwg2wOMqC0c7hvFs71CEpiKp8rwX3+c/UbdX0q8bXmoaPI
vOb2FZCuD9iLGjieXW/9MdKBtAIclwqIeedSgCN18e7J204asNBVc5vsuv5C/ckf
6cQJv7apMIjggdXMCwIDAQAB
-----END PUBLIC KEY-----`);
  return rsa.encrypt(str);
}

export default { encrypt };
