# TravelPals

## Description

TravelPals is a full-stack social media site that brings together travel enthusiasts from around the world. Create an account, share your travel adventures by posting the places you have traveled to, and connect with other users by commenting on and liking their posts. With TravelPals, you have full control over your content - create, edit, and delete posts and comments where you have the necessary permissions.

## Features

- **User Account Creation**: Sign up to become a part of the TravelPals community and start sharing your travel experiences.
- **Post Travel Adventures**: Share the places you have traveled to with the TravelPals community by creating posts.
- **Interactive Engagement**: Engage with other users' posts through comments and likes, fostering a sense of community and connection.
- **Post and Comment Management**: Edit or delete your posts and comments where you have appropriate permissions.
- **User Permissions**: Control over who can edit or delete your posts and comments to maintain the privacy of your content.

## Technologies Used

- Next.js
- React
- MongoDB
- NextAuth.js (for account authentication and security)
- bcrypt (for securely hashing passwords)
- CSS


## API Endpoints

The API endpoints are seamlessly integrated into the Next.js app using Next.js's API routes feature. Node.js code is used to create the backend API endpoints, all inside one Next.js app, utilizing Next.js features to write the backend code within the frontend.

## Authentication and Security

NextAuth.js is employed to handle account authentication and security. User passwords are securely hashed using bcrypt for safe storage.

## SEO and Load Time Optimization

TravelPals leverages Next.js's powerful features, including `getStaticPaths`, `getStaticProps`, and `getServerSideProps`, to enhance SEO and improve load times significantly.

- **getStaticPaths**: With this feature, Next.js generates static HTML pages for dynamic routes during the build process. This pre-rendering strategy allows search engines to index all your dynamic pages, resulting in better SEO. Additionally, static pages are served directly from the CDN, improving load times for users.

- **getStaticProps**: By using `getStaticProps`, TravelPals can fetch data at build time and pass it as props to the corresponding page. This ensures that the content is already available to the user when they land on the page, reducing the initial loading time and making your site more SEO-friendly.

- **getServerSideProps**: For dynamic content that changes frequently or requires server-side data fetching, `getServerSideProps` comes in handy. This function fetches data on each request, ensuring that your pages are always up-to-date and relevant.

By incorporating these Next.js features, TravelPals achieves improved SEO rankings, better user experiences with faster page loads, and enhanced search engine discoverability of your travel content.

