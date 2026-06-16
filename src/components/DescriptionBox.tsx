function DescriptionBox() {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
      <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <div className="px-6 py-3 text-pink-500 border-b-2 border-pink-500 font-medium text-sm">
            Description
          </div>
          <div className="px-6 py-3 text-slate-500 text-sm">
            Reviews (122)
          </div>
        </div>
        {/* Content */}
        <div className="p-6 space-y-4 text-slate-400 text-sm leading-relaxed">
          <p>
            Elegant and sophisticated, this piece features a stunning color
            design, perfect for any occasion.
          </p>
          <p>
            Stay stylish with our piece, crafted from this fabric for ultimate
            comfort.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DescriptionBox;
