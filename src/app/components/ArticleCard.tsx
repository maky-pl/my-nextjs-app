import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
}

const ArticleCard = ({ title, date, location, imageUrl, description }: ArticleCardProps) => (
  <div className="bg-gray-100 p-4 rounded-md shadow-md">
    <Image src={imageUrl} alt={title} width={300} height={200} className="w-full h-auto" />
    <h4 className="mt-2 font-bold">{title}</h4>
    <div className="mt-1">
      <span>{date} | {location}</span>
    </div>
    <p className="mt-2">{description}</p>
  </div>
);

export default ArticleCard;
