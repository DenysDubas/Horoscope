const isGithubPages = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  basePath: isGithubPages ? '/Horoscope' : '',
  assetPrefix: isGithubPages ? '/Horoscope/' : '',
};
