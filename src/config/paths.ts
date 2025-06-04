import 'module-alias/register';
import { addAliases } from 'module-alias';
import path from 'path';

addAliases({
    '@': path.join(__dirname, '..'),
    '@config': path.join(__dirname, '..', 'config'),
    '@controllers': path.join(__dirname, '..', 'controllers'),
    '@routes': path.join(__dirname, '..', 'routes'),
    '@middleware': path.join(__dirname, '..', 'middleware'),
    '@prisma': path.join(__dirname, '..', 'prisma', 'schema'),
    '@types': path.join(__dirname, '..', 'types'),
    '@utils': path.join(__dirname, '..', 'utils'),
    '@prisma/client': path.join(__dirname, '../../node_modules/@prisma/client')
});