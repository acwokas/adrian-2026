// Shared reading and listening details for /now and the homepage.
// Affiliate links supplied by Adrian on 10 September 2026.
export type Book = { id: string; title: string; author: string; affiliateUrl: string | null };
export const currentBooks: Book[] = [
  { id: 'dim-sum-strategy', title: 'Dim Sum Strategy', author: 'Peter Wilken', affiliateUrl: 'https://link.amazon/B0gfwv66n' },
  { id: 'co-existing-with-ai', title: 'Co-existing with AI', author: 'Kay Firth-Butterfield', affiliateUrl: 'https://link.amazon/B03tCAjBx' },
];
export const magazines = [
  { name: 'Monocle', url: 'https://monocle.com/' },
  { name: 'The Economist', url: 'https://www.economist.com/' },
  { name: 'Private Eye', url: 'https://www.private-eye.co.uk/' },
];
export const podcasts = [
  { name: 'The Rest Is Politics', url: 'https://therestispolitics.com/' },
  { name: 'Uncanny Valley', url: 'https://www.wired.com/podcast/uncanny-valley/' },
  { name: 'Talk of the Devils', url: 'https://podfollow.com/talk-of-the-devils/view' },
  { name: 'Entrepreneurship Unplugged in Southeast Asia', host: 'Paddy Tan', url: 'https://open.spotify.com/show/6BkRRUDQz6t2XkRkiAY6Y5?si=fe2761aff97648fd' },
];
export const regularAuthor = { name: 'Rory Sutherland', url: 'https://www.youtube.com/@rorysutherlandsmadmasters' };
export function currentCardLine(): string {
  return `Current: ${currentBooks.map(book => book.title).join(' and ')}.`;
}
export function digestReadingLine(): string {
  return `Reading: ${currentBooks.map(book => `${book.title} by ${book.author}`).join(' and ')}.`;
}

export const currentMusic = { name: 'In Search of Sunrise', url: 'https://open.spotify.com/playlist/6IpR5LLAjy2jKzEKqxcEmo?si=84720ee6207245eb' };
