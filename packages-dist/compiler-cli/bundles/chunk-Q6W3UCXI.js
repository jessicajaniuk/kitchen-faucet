
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  TypeScriptReflectionHost
} from "./chunk-O4JLZZWJ.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/downlevel_decorators_transform/downlevel_decorators_transform.mjs
import ts2 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/downlevel_decorators_transform/patch_alias_reference_resolution.mjs
import ts from "typescript";
var patchedReferencedAliasesSymbol = Symbol("patchedReferencedAliases");
function loadIsReferencedAliasDeclarationPatch(context) {
  if (!isTransformationContextWithEmitResolver(context)) {
    throwIncompatibleTransformationContextError();
  }
  const emitResolver = context.getEmitResolver();
  const existingReferencedAliases = emitResolver[patchedReferencedAliasesSymbol];
  if (existingReferencedAliases !== void 0) {
    return existingReferencedAliases;
  }
  const originalIsReferencedAliasDeclaration = emitResolver.isReferencedAliasDeclaration;
  if (originalIsReferencedAliasDeclaration === void 0) {
    throwIncompatibleTransformationContextError();
  }
  const referencedAliases = /* @__PURE__ */ new Set();
  emitResolver.isReferencedAliasDeclaration = function(node, ...args) {
    if (isAliasImportDeclaration(node) && referencedAliases.has(node)) {
      return true;
    }
    return originalIsReferencedAliasDeclaration.call(emitResolver, node, ...args);
  };
  return emitResolver[patchedReferencedAliasesSymbol] = referencedAliases;
}
function isAliasImportDeclaration(node) {
  return ts.isImportSpecifier(node) || ts.isNamespaceImport(node) || ts.isImportClause(node);
}
function isTransformationContextWithEmitResolver(context) {
  return context.getEmitResolver !== void 0;
}
function throwIncompatibleTransformationContextError() {
  throw Error("Unable to downlevel Angular decorators due to an incompatible TypeScript version.\nIf you recently updated TypeScript and this issue surfaces now, consider downgrading.\n\nPlease report an issue on the Angular repositories when this issue surfaces and you are using a supposedly compatible TypeScript version.");
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/downlevel_decorators_transform/downlevel_decorators_transform.mjs
function isAngularDecorator(decorator, isCore) {
  return isCore || decorator.import !== null && decorator.import.from === "@angular/core";
}
var DECORATOR_INVOCATION_JSDOC_TYPE = "!Array<{type: !Function, args: (undefined|!Array<?>)}>";
function extractMetadataFromSingleDecorator(decorator, diagnostics) {
  const metadataProperties = [];
  const expr = decorator.expression;
  switch (expr.kind) {
    case ts2.SyntaxKind.Identifier:
      metadataProperties.push(ts2.factory.createPropertyAssignment("type", expr));
      break;
    case ts2.SyntaxKind.CallExpression:
      const call = expr;
      metadataProperties.push(ts2.factory.createPropertyAssignment("type", call.expression));
      if (call.arguments.length) {
        const args = [];
        for (const arg of call.arguments) {
          args.push(arg);
        }
        const argsArrayLiteral = ts2.factory.createArrayLiteralExpression(ts2.factory.createNodeArray(args, true));
        metadataProperties.push(ts2.factory.createPropertyAssignment("args", argsArrayLiteral));
      }
      break;
    default:
      diagnostics.push({
        file: decorator.getSourceFile(),
        start: decorator.getStart(),
        length: decorator.getEnd() - decorator.getStart(),
        messageText: `${ts2.SyntaxKind[decorator.kind]} not implemented in gathering decorator metadata.`,
        category: ts2.DiagnosticCategory.Error,
        code: 0
      });
      break;
  }
  return ts2.factory.createObjectLiteralExpression(metadataProperties);
}
function createCtorParametersClassProperty(diagnostics, entityNameToExpression, ctorParameters, isClosureCompilerEnabled) {
  const params = [];
  for (const ctorParam of ctorParameters) {
    if (!ctorParam.type && ctorParam.decorators.length === 0) {
      params.push(ts2.factory.createNull());
      continue;
    }
    const paramType = ctorParam.type ? typeReferenceToExpression(entityNameToExpression, ctorParam.type) : void 0;
    const members = [ts2.factory.createPropertyAssignment("type", paramType || ts2.factory.createIdentifier("undefined"))];
    const decorators = [];
    for (const deco of ctorParam.decorators) {
      decorators.push(extractMetadataFromSingleDecorator(deco, diagnostics));
    }
    if (decorators.length) {
      members.push(ts2.factory.createPropertyAssignment("decorators", ts2.factory.createArrayLiteralExpression(decorators)));
    }
    params.push(ts2.factory.createObjectLiteralExpression(members));
  }
  const initializer = ts2.factory.createArrowFunction(void 0, void 0, [], void 0, ts2.factory.createToken(ts2.SyntaxKind.EqualsGreaterThanToken), ts2.factory.createArrayLiteralExpression(params, true));
  const ctorProp = ts2.factory.createPropertyDeclaration([ts2.factory.createToken(ts2.SyntaxKind.StaticKeyword)], "ctorParameters", void 0, void 0, initializer);
  if (isClosureCompilerEnabled) {
    ts2.setSyntheticLeadingComments(ctorProp, [
      {
        kind: ts2.SyntaxKind.MultiLineCommentTrivia,
        text: [
          `*`,
          ` * @type {function(): !Array<(null|{`,
          ` *   type: ?,`,
          ` *   decorators: (undefined|${DECORATOR_INVOCATION_JSDOC_TYPE}),`,
          ` * })>}`,
          ` * @nocollapse`,
          ` `
        ].join("\n"),
        pos: -1,
        end: -1,
        hasTrailingNewLine: true
      }
    ]);
  }
  return ctorProp;
}
function typeReferenceToExpression(entityNameToExpression, node) {
  let kind = node.kind;
  if (ts2.isLiteralTypeNode(node)) {
    kind = node.literal.kind;
  }
  switch (kind) {
    case ts2.SyntaxKind.FunctionType:
    case ts2.SyntaxKind.ConstructorType:
      return ts2.factory.createIdentifier("Function");
    case ts2.SyntaxKind.ArrayType:
    case ts2.SyntaxKind.TupleType:
      return ts2.factory.createIdentifier("Array");
    case ts2.SyntaxKind.TypePredicate:
    case ts2.SyntaxKind.TrueKeyword:
    case ts2.SyntaxKind.FalseKeyword:
    case ts2.SyntaxKind.BooleanKeyword:
      return ts2.factory.createIdentifier("Boolean");
    case ts2.SyntaxKind.StringLiteral:
    case ts2.SyntaxKind.StringKeyword:
      return ts2.factory.createIdentifier("String");
    case ts2.SyntaxKind.ObjectKeyword:
      return ts2.factory.createIdentifier("Object");
    case ts2.SyntaxKind.NumberKeyword:
    case ts2.SyntaxKind.NumericLiteral:
      return ts2.factory.createIdentifier("Number");
    case ts2.SyntaxKind.TypeReference:
      const typeRef = node;
      return entityNameToExpression(typeRef.typeName);
    case ts2.SyntaxKind.UnionType:
      const childTypeNodes = node.types.filter((t) => !(ts2.isLiteralTypeNode(t) && t.literal.kind === ts2.SyntaxKind.NullKeyword));
      return childTypeNodes.length === 1 ? typeReferenceToExpression(entityNameToExpression, childTypeNodes[0]) : void 0;
    default:
      return void 0;
  }
}
function symbolIsRuntimeValue(typeChecker, symbol) {
  if (symbol.flags & ts2.SymbolFlags.Alias) {
    symbol = typeChecker.getAliasedSymbol(symbol);
  }
  return (symbol.flags & ts2.SymbolFlags.Value & ts2.SymbolFlags.ConstEnumExcludes) !== 0;
}
function getDownlevelDecoratorsTransform(typeChecker, host, diagnostics, isCore, isClosureCompilerEnabled, skipClassDecorators) {
  function addJSDocTypeAnnotation(node, jsdocType) {
    if (!isClosureCompilerEnabled) {
      return;
    }
    ts2.setSyntheticLeadingComments(node, [
      {
        kind: ts2.SyntaxKind.MultiLineCommentTrivia,
        text: `* @type {${jsdocType}} `,
        pos: -1,
        end: -1,
        hasTrailingNewLine: true
      }
    ]);
  }
  function createDecoratorClassProperty(decoratorList) {
    const modifier = ts2.factory.createToken(ts2.SyntaxKind.StaticKeyword);
    const initializer = ts2.factory.createArrayLiteralExpression(decoratorList, true);
    const prop = ts2.factory.createPropertyDeclaration([modifier], "decorators", void 0, void 0, initializer);
    addJSDocTypeAnnotation(prop, DECORATOR_INVOCATION_JSDOC_TYPE);
    return prop;
  }
  function createPropDecoratorsClassProperty(diagnostics2, properties) {
    const entries = [];
    for (const [name, decorators] of properties.entries()) {
      entries.push(ts2.factory.createPropertyAssignment(name, ts2.factory.createArrayLiteralExpression(decorators.map((deco) => extractMetadataFromSingleDecorator(deco, diagnostics2)))));
    }
    const initializer = ts2.factory.createObjectLiteralExpression(entries, true);
    const prop = ts2.factory.createPropertyDeclaration([ts2.factory.createToken(ts2.SyntaxKind.StaticKeyword)], "propDecorators", void 0, void 0, initializer);
    addJSDocTypeAnnotation(prop, `!Object<string, ${DECORATOR_INVOCATION_JSDOC_TYPE}>`);
    return prop;
  }
  return (context) => {
    const referencedParameterTypes = loadIsReferencedAliasDeclarationPatch(context);
    function entityNameToExpression(name) {
      const symbol = typeChecker.getSymbolAtLocation(name);
      if (!symbol || !symbolIsRuntimeValue(typeChecker, symbol) || !symbol.declarations || symbol.declarations.length === 0) {
        return void 0;
      }
      if (ts2.isQualifiedName(name)) {
        const containerExpr = entityNameToExpression(name.left);
        if (containerExpr === void 0) {
          return void 0;
        }
        return ts2.factory.createPropertyAccessExpression(containerExpr, name.right);
      }
      const decl = symbol.declarations[0];
      if (isAliasImportDeclaration(decl)) {
        referencedParameterTypes.add(decl);
        if (decl.name !== void 0) {
          return ts2.setOriginalNode(ts2.factory.createIdentifier(decl.name.text), decl.name);
        }
      }
      return ts2.setOriginalNode(ts2.factory.createIdentifier(name.text), name);
    }
    function transformClassElement(element) {
      element = ts2.visitEachChild(element, decoratorDownlevelVisitor, context);
      const decoratorsToKeep = [];
      const toLower = [];
      const decorators = host.getDecoratorsOfDeclaration(element) || [];
      for (const decorator of decorators) {
        const decoratorNode = decorator.node;
        if (!isAngularDecorator(decorator, isCore)) {
          decoratorsToKeep.push(decoratorNode);
          continue;
        }
        toLower.push(decoratorNode);
      }
      if (!toLower.length)
        return [void 0, element, []];
      if (!element.name || !ts2.isIdentifier(element.name)) {
        diagnostics.push({
          file: element.getSourceFile(),
          start: element.getStart(),
          length: element.getEnd() - element.getStart(),
          messageText: `Cannot process decorators for class element with non-analyzable name.`,
          category: ts2.DiagnosticCategory.Error,
          code: 0
        });
        return [void 0, element, []];
      }
      const elementModifiers = ts2.canHaveModifiers(element) ? ts2.getModifiers(element) : void 0;
      let modifiers;
      if (decoratorsToKeep.length || (elementModifiers == null ? void 0 : elementModifiers.length)) {
        modifiers = ts2.setTextRange(ts2.factory.createNodeArray([...decoratorsToKeep, ...elementModifiers || []]), element.modifiers);
      }
      return [element.name.text, cloneClassElementWithModifiers(element, modifiers), toLower];
    }
    function transformConstructor(ctor) {
      ctor = ts2.visitEachChild(ctor, decoratorDownlevelVisitor, context);
      const newParameters = [];
      const oldParameters = ctor.parameters;
      const parametersInfo = [];
      for (const param of oldParameters) {
        const decoratorsToKeep = [];
        const paramInfo = { decorators: [], type: null };
        const decorators = host.getDecoratorsOfDeclaration(param) || [];
        for (const decorator of decorators) {
          const decoratorNode = decorator.node;
          if (!isAngularDecorator(decorator, isCore)) {
            decoratorsToKeep.push(decoratorNode);
            continue;
          }
          paramInfo.decorators.push(decoratorNode);
        }
        if (param.type) {
          paramInfo.type = param.type;
        }
        parametersInfo.push(paramInfo);
        let modifiers;
        const paramModifiers = ts2.getModifiers(param);
        if (decoratorsToKeep.length || (paramModifiers == null ? void 0 : paramModifiers.length)) {
          modifiers = [...decoratorsToKeep, ...paramModifiers || []];
        }
        const newParam = ts2.factory.updateParameterDeclaration(param, modifiers, param.dotDotDotToken, param.name, param.questionToken, param.type, param.initializer);
        newParameters.push(newParam);
      }
      const updated = ts2.factory.updateConstructorDeclaration(ctor, ts2.getModifiers(ctor), newParameters, ctor.body);
      return [updated, parametersInfo];
    }
    function transformClassDeclaration(classDecl) {
      const newMembers = [];
      const decoratedProperties = /* @__PURE__ */ new Map();
      let classParameters = null;
      for (const member of classDecl.members) {
        switch (member.kind) {
          case ts2.SyntaxKind.PropertyDeclaration:
          case ts2.SyntaxKind.GetAccessor:
          case ts2.SyntaxKind.SetAccessor:
          case ts2.SyntaxKind.MethodDeclaration: {
            const [name, newMember, decorators] = transformClassElement(member);
            newMembers.push(newMember);
            if (name)
              decoratedProperties.set(name, decorators);
            continue;
          }
          case ts2.SyntaxKind.Constructor: {
            const ctor = member;
            if (!ctor.body)
              break;
            const [newMember, parametersInfo] = transformConstructor(member);
            classParameters = parametersInfo;
            newMembers.push(newMember);
            continue;
          }
          default:
            break;
        }
        newMembers.push(ts2.visitEachChild(member, decoratorDownlevelVisitor, context));
      }
      const decoratorsToKeep = new Set(ts2.getDecorators(classDecl));
      const possibleAngularDecorators = host.getDecoratorsOfDeclaration(classDecl) || [];
      let hasAngularDecorator = false;
      const decoratorsToLower = [];
      for (const decorator of possibleAngularDecorators) {
        const decoratorNode = decorator.node;
        const isNgDecorator = isAngularDecorator(decorator, isCore);
        if (isNgDecorator) {
          hasAngularDecorator = true;
        }
        if (isNgDecorator && !skipClassDecorators) {
          decoratorsToLower.push(extractMetadataFromSingleDecorator(decoratorNode, diagnostics));
          decoratorsToKeep.delete(decoratorNode);
        }
      }
      if (decoratorsToLower.length) {
        newMembers.push(createDecoratorClassProperty(decoratorsToLower));
      }
      if (classParameters) {
        if (hasAngularDecorator || classParameters.some((p) => !!p.decorators.length)) {
          newMembers.push(createCtorParametersClassProperty(diagnostics, entityNameToExpression, classParameters, isClosureCompilerEnabled));
        }
      }
      if (decoratedProperties.size) {
        newMembers.push(createPropDecoratorsClassProperty(diagnostics, decoratedProperties));
      }
      const members = ts2.setTextRange(ts2.factory.createNodeArray(newMembers, classDecl.members.hasTrailingComma), classDecl.members);
      const classModifiers = ts2.getModifiers(classDecl);
      let modifiers;
      if (decoratorsToKeep.size || (classModifiers == null ? void 0 : classModifiers.length)) {
        modifiers = [...decoratorsToKeep, ...classModifiers || []];
      }
      return ts2.factory.updateClassDeclaration(classDecl, modifiers, classDecl.name, classDecl.typeParameters, classDecl.heritageClauses, members);
    }
    function decoratorDownlevelVisitor(node) {
      if (ts2.isClassDeclaration(node)) {
        return transformClassDeclaration(node);
      }
      return ts2.visitEachChild(node, decoratorDownlevelVisitor, context);
    }
    return (sf) => {
      return ts2.visitEachChild(sf, decoratorDownlevelVisitor, context);
    };
  };
}
function cloneClassElementWithModifiers(node, modifiers) {
  let clone;
  if (ts2.isMethodDeclaration(node)) {
    clone = ts2.factory.createMethodDeclaration(modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
  } else if (ts2.isPropertyDeclaration(node)) {
    clone = ts2.factory.createPropertyDeclaration(modifiers, node.name, node.questionToken, node.type, node.initializer);
  } else if (ts2.isGetAccessor(node)) {
    clone = ts2.factory.createGetAccessorDeclaration(modifiers, node.name, node.parameters, node.type, node.body);
  } else if (ts2.isSetAccessor(node)) {
    clone = ts2.factory.createSetAccessorDeclaration(modifiers, node.name, node.parameters, node.body);
  } else {
    throw new Error(`Unsupported decorated member with kind ${ts2.SyntaxKind[node.kind]}`);
  }
  return ts2.setOriginalNode(clone, node);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/private/tooling.mjs
var GLOBAL_DEFS_FOR_TERSER = {
  ngDevMode: false,
  ngI18nClosureMode: false
};
var GLOBAL_DEFS_FOR_TERSER_WITH_AOT = {
  ...GLOBAL_DEFS_FOR_TERSER,
  ngJitMode: false
};
function constructorParametersDownlevelTransform(program) {
  const typeChecker = program.getTypeChecker();
  const reflectionHost = new TypeScriptReflectionHost(typeChecker);
  return getDownlevelDecoratorsTransform(
    typeChecker,
    reflectionHost,
    [],
    false,
    false,
    true
  );
}

export {
  GLOBAL_DEFS_FOR_TERSER,
  GLOBAL_DEFS_FOR_TERSER_WITH_AOT,
  constructorParametersDownlevelTransform
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=chunk-Q6W3UCXI.js.map
