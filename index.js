const mysql = require('mysql2/promise'); // Importando o cliente MySQL

// Conexão com o Banco (validar o host/user)
const dbConfig = {
    host: 'endpoint',
    user: 'user',
    password: 'pass',
    database: 'dbMySql',
};

exports.handler = async (event) => {
    // Extrair os parâmetros da chamada da api
    const cpf = event.queryStringParameters?.cpf;

    // Validação básica
    if (!cpf || cpf.length !== 11) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "CPF inválido" })
        };
    }

    try {
        // Realizando Conexão
        const connection = await mysql.createConnection(dbConfig);

        // Consulta do CPF no banco
        const [rows] = await connection.execute('SELECT * FROM customers WHERE cpf = ?', [cpf]);
        
        await connection.end();

        // Resposta com base na validação
        if (rows.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Autenticação bem-sucedida" })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "CPF não encontrado ou não autorizado" })
            };
        }

    } catch (error) {

        # Tratamento em caso de erro ao conectar
        
        console.error('Erro ao conectar ao banco de dados:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno do servidor" })
        };
    }
};
