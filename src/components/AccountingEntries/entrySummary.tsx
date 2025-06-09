type EntrySummaryProps = {
    title: string;
    value: string | number;
    color: string;
};

export function EntrySummary({ title, value, color }: EntrySummaryProps) {
    return (
        <div className="bg-white w-full py-5 md:py-10 rounded-lg shadow-md flex flex-col items-center justify-center ">
            <h1 className="font-semibold mb-2 text-gray text-xl md:text-2xl uppercase text-center ">
                {title}
            </h1>
            <p style={{ color: color }} className="text-2xl md:text-4xl font-bold ">
                {value.toLocaleString("pt-BR", {
                    style: 'currency', currency: 'BRL'
                })}
            </p>
        </div>
    );
}