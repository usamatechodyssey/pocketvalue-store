type SectionHeadingProps = {
  title: string;
};

export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="border-t border-gray-300 flex-grow mx-4" />
      <h2 className="text-lg md:text-xl font-semibold text-[#800000]">
        {title}
      </h2>
      <div className="border-t border-gray-300 flex-grow mx-4" />
    </div>
  );
}
