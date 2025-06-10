import Logo from '/logo.svg';
import SuricatoImg from '/suricato.png';

export function Header() {
  return (
    <header className="flex justify-between my-8">
      <img src={Logo} alt="Logo" />
      <div className="flex gap-2 justify-center items-center">
        <p className="hidden sm:text-gray sm:text-sm sm:block">
          Welcome, <span className="text-primary font-bold">Suricato</span>!
        </p>
        <img src={SuricatoImg} className="size-12 rounded-full bg-gray-700" />
      </div>
    </header>
  );
}

