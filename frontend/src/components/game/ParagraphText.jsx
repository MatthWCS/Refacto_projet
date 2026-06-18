export function ParagraphText({ content, contentAfter, paragraphId }) {
    return (
        <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5
                            bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
            <p className="text-xs text-emerald-700/60 mb-3 font-mono">§ {paragraphId}</p>
            <p className="text-base-content/90 leading-relaxed text-[15px]">{content}</p>
            {contentAfter && (
                <p className="text-base-content/90 leading-relaxed text-[15px] mt-4
                              border-t border-emerald-900/30 pt-4">
                    {contentAfter}
                </p>
            )}
        </div>
    )
}