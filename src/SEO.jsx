import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, url, image, type = "website", keywords }) => {
  const fullTitle = title
    ? `${title} | krushayu — Aayush Shrivastava`
    : "Aayush Shrivastava (krushayu) | Full Stack Developer";

  const fullUrl = url ? `https://krushayu.in${url}` : "https://krushayu.in";
  const fullImage = image || "https://krushayu.in/profile.jpg";
  const fullDesc = description || "Portfolio of Aayush Shrivastava (krushayu) — Full Stack MERN Developer from Odisha, India.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Aayush Shrivastava" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="krushayu | Aayush Shrivastava" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@krushayu" />
    </Helmet>
  );
};

export default SEO;
