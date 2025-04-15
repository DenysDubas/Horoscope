const isGithubPages = process.env.NODE_ENV === 'production';

const repo = 'Horoscope';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? `/${repo}` : '',
  assetPrefix: isGithubPages ? `/${repo}/` : '',
};

module.exports = nextConfig;
