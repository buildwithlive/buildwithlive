import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/reader', '/api/', '/payment/success'], // මේවා Google එකට පෙන්වන්න එපා
    },
    sitemap: 'https://www.buildwithvideos.com/sitemap.xml',
  };
}