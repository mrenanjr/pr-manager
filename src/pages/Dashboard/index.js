import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Header, PRImg, Title, Form, Error, Repositories } from './style';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { GET_PULLREQUESTS } from '../../graphql/get-pullrequests';

import gql from 'graphql-tag';
import pullRequestSvg from '../../assets/pr.svg';

const Dashboard = () => {
  const [showInputToken, setShowInputToken] = useState(true);
  const [newToken, setNewToken] = useState('');
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    if(localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME)) {
      setShowInputToken(false);
    }
  }, []);

  const handleResetToken = (event) => {
    event.preventDefault();

    localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);

    setShowInputToken(true);
    clearInputs();
  }

  const handleUseToken = (event) => {
    event.preventDefault();

    if(!newToken) {
      setInputError('Coloque o token para autenticar na API do GitHub');
      return;
    }

    try {
      const PROFILE_QUERY = gql`
        query {
          viewer {
            login
          }
        }
      `;
      const { data } = useQuery(PROFILE_QUERY);

      console.log(data);

      localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME, newToken);

      clearInputs();
      setShowInputToken(false);
    } catch (err) {
      setInputError(`Falha na autenticação. Error: ${err}`);
    }
  }

  const handleAddRepository = (event) => {
    event.preventDefault();

    if(!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      clearInputs();
    } catch(err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  const clearInputs = () => {
    setNewToken('');
    setInputError('');
  }

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Pull Request Manager</strong>
        </PRImg>

        {!showInputToken &&
          <a onClick={handleResetToken}>
            <FiLogOut size={20}/>
            Reset Token
          </a>
        }
      </Header>

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
