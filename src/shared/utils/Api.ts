import Axios, { AxiosResponse } from 'axios';

function query(q: string) {
    console.log('Query:\n', q);
    return { query: q };
}

const loginData =
    `token refreshToken
    myUser {
        username verified
        preferences {
            enableAutoSkip skipBranding skipIntros skipNewIntros skipRecaps skipFiller skipCanon
            skipTransitions skipTitleCard skipCredits skipMixedCredits skipPreview
        }
    }`;

type LoginResponse = AxiosResponse<{
    data: {
        login: Api.LoginResponse;
    };
}>;

export default class Api {

    public static async loginManual(username: string, password: string): Promise<Api.LoginResponse> {
        const response: LoginResponse = await Axios.post(
            'http://api.anime-skip.com/graphql',
            query(`{
                login(usernameOrEmail: "${username}", password: "${password}") {
                    ${loginData}
                }
            }`),
        );
        return response.data.data.login;
    }

    public static async loginRefresh(refreshToken: string): Promise<Api.LoginResponse> {
        const response: LoginResponse = await Axios.post(
            'http://localhost:8000/graphql',
            query(`{
                login(refreshToken: "${refreshToken}") {
                    ${loginData}
                }
            }`),
        );
        return response.data.data.login;
    }

}
