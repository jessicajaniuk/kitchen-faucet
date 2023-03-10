/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
import { Reference } from '../../../src/ngtsc/imports';
import { ClassDeclaration } from '../../../src/ngtsc/reflection';
import { Migration, MigrationHost } from './migration';
export declare class UndecoratedChildMigration implements Migration {
    apply(clazz: ClassDeclaration, host: MigrationHost): ts.Diagnostic | null;
    maybeMigrate(ref: Reference<ClassDeclaration>, host: MigrationHost): void;
}
