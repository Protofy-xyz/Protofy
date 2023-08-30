/* MIT License

Copyright (c) 2022-present, PROTOFY.XYZ, S.L.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

import ApiCaller from 'baseapp/core/ApiCaller';
import PaletteModel, { PaletteCollection } from 'baseapp/common/domain/Palette';
import User from 'baseapp/models/user';

const getApiCaller = (currentUser?: User): ApiCaller => {
    const apiCaller = new ApiCaller(currentUser?.token);
    return apiCaller
}

class PaletteApi {
    constructor() { }

    static async all(currentUser: User): Promise<PaletteCollection> {
        const data = await getApiCaller(currentUser).call('/v1/palettes', 'GET');
        return new PaletteCollection(data.map((item: any) => {
            return new PaletteModel(item);
        }));
    }

    static async read(currentUser: User, name: string): Promise<PaletteModel> {
        const data = await getApiCaller(currentUser).call('/v1/palettes/' + name, 'GET');
        return new PaletteModel(data);
    }

    static async create(currentUser: User, palette: PaletteModel): Promise<PaletteModel> {
        const data = await getApiCaller(currentUser).call('/v1/palettes', 'POST', palette.toObject());
        return new PaletteModel(data);
    }

    static async update(currentUser: User, palette: PaletteModel): Promise<PaletteModel> {
        const data = await getApiCaller(currentUser).call('/v1/palettes/' + palette.getId(), 'POST', palette.toObject());
        return new PaletteModel(data);
    }

    static async delete(currentUser: User, id: string): Promise<void> {
        return await getApiCaller(currentUser).call('/v1/palettes/' + id + '/delete', 'GET');
    }

    static async load(currentUser?: User): Promise<void> {
        const id = "all"
        return await getApiCaller(currentUser).call('/v1/palettes/' + id + '/load', 'GET');
    }
}

export default PaletteApi;