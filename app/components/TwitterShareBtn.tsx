export default function TwitterShareBtn({ url, text }: { url: string; text: string }) {
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(text)}`;

    return (
        <div>
            <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 !text-white py-2 px-4 rounded"
            >
                Share on Twitter
            </a>
        </div>
    )
}
