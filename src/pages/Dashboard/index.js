import React, { useState, useEffect } from 'react';
import { PRImg, Title, Form, Error, Repositories } from './style';
import { FiChevronRight } from 'react-icons/fi';

import pullRequestSvg from '../../assets/pr.svg';

const Dashboard = () => {
  const [showInputToken, setShowInputToken] = useState(true);
  const [newToken, setNewToken] = useState('');
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    if(localStorage.getItem('tokenGitHubGraphQL'))
      showInputToken(false);
  }, []);

  async function handleUseToken(event) {
    event.preventDefault();

    if(!newToken) {
      setInputError('Defina o token');
      return;
    }

    console.log(newToken);

    localStorage.setItem('tokenGitHubGraphQL', newToken);

    setNewToken('');
    setShowInputToken(false);
    setInputError('');
  }

  function handleAddRepository(event) {
    event.preventDefault();

    if(!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    console.log(newRepo);

    try {
      setNewRepo('');
      setInputError('');
    } catch(err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <PRImg>
        <img src={pullRequestSvg}  alt="Pull request SVG"></img>
        <strong>Pull Request Manager</strong>
      </PRImg>

      <Title>Multi Repo PR Manager</Title>

      {showInputToken ?
        <Form hasError={!!inputError} onSubmit={handleUseToken}>
          <input
            value={newToken}
            onChange={e => setNewToken(e.target.value)}
            placeholder="Informe seu token de acesso"
          />
          <button type="submit">Usar</button>
        </Form>
        :
        <Form hasError={!!inputError} onSubmit={handleAddRepository}>
          <input
            value={newRepo}
            onChange={e => setNewRepo(e.target.value)}
            placeholder="Informe o seu repositório"
          />
          <button type="submit">Pesquisar</button>
        </Form>
      }

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        <a href="teste">
          <img></img>

          <div>
            <strong>Repositório</strong>
            <p>Descrição do repositório</p>
          </div>

          <FiChevronRight size={20} />
        </a>
      </Repositories>
    </>
  );
}

export default Dashboard;
