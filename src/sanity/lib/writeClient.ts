// src/sanity/lib/writeClient.ts
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '../env';

// Yeh client sirf Server Actions mein istemal hoga
export const writeClient = createClient({
  apiVersion,
  dataset,
  projectId,
  token: process.env.SANITY_API_WRITE_TOKEN, // Aapka token .env se yahan aayega
  useCdn: false, // Writing ke liye hamesha 'false' hona chahiye
});