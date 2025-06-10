## 📝 Descrição do Projeto

Este projeto está sendo desenvolvido para otimizar a gestão contábil da ContAI, referência no mercado contábil.

O objetivo do sistema é automatizar e simplificar o registro, organização e visualização de lançamentos financeiros, proporcionando maior controle e eficiência no acompanhamento das finanças empresariais.

A plataforma permitirá o cadastro diário e estruturado dos lançamentos contábeis, com visualização em tabelas mensais e armazenamento seguro em banco de dados. Dessa forma, o setor contábil, gestores e responsáveis financeiros terão acesso facilitado e seguro às informações.

## 🚀 Como rodar o projeto

Siga os passos abaixo para rodar o projeto localmente em sua máquina:

1. **Clone o repositório**

  Abra o terminal e execute:

  ```bash
  git clone git@github.com:vinigs22/contai-frontend.git
  cd contai-frontend
  ```

2. **Instale as dependências**

  Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (versão recomendada: 18.x ou superior). Em seguida, instale as dependências do projeto:

  ```bash
  npm install
  ```

3. **Configure as variáveis de ambiente**

  Crie um arquivo `.env` na raiz do projeto, se necessário, com as variáveis de ambiente exigidas. Consulte o arquivo `.env.example` para saber quais variáveis precisam ser configuradas.

4. **Inicie o servidor de desenvolvimento**

  Execute o comando abaixo para iniciar o projeto em modo de desenvolvimento:

  ```bash
  npm run dev
  ```

  O servidor será iniciado e normalmente estará disponível em [http://localhost:5173](http://localhost:5173) (ou outra porta informada no terminal).

5. **Acesse a aplicação**

  Abra seu navegador e acesse o endereço exibido no terminal para utilizar a aplicação.

---

**Observações:**
- Para outros comandos disponíveis (build, lint, testes, etc.), consulte a seção de scripts no `package.json`.
- Caso encontre problemas, verifique se todas as dependências estão corretamente instaladas e se as variáveis de ambiente estão configuradas.