/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { clearTranslations, loadTranslations } from './src/translate';
// Exports that are not part of the public API
export * from './private';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9sb2NhbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFLSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUdwRSw4Q0FBOEM7QUFDOUMsY0FBYyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBwdWJsaWMgQVBJIG9mIHRoZSBgQGFuZ3VsYXIvbG9jYWxpemVgIGVudHJ5LXBvaW50XG5pbXBvcnQge0xvY2FsaXplRm59IGZyb20gJy4vc3JjL2xvY2FsaXplJztcblxuZXhwb3J0IHtjbGVhclRyYW5zbGF0aW9ucywgbG9hZFRyYW5zbGF0aW9uc30gZnJvbSAnLi9zcmMvdHJhbnNsYXRlJztcbmV4cG9ydCB7TWVzc2FnZUlkLCBUYXJnZXRNZXNzYWdlfSBmcm9tICcuL3NyYy91dGlscyc7XG5cbi8vIEV4cG9ydHMgdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBBUElcbmV4cG9ydCAqIGZyb20gJy4vcHJpdmF0ZSc7XG5cbi8vIGBkZWNsYXJlIGdsb2JhbGAgYWxsb3dzIHVzIHRvIGVzY2FwZSB0aGUgY3VycmVudCBtb2R1bGUgYW5kIHBsYWNlIHR5cGVzIG9uIHRoZSBnbG9iYWwgbmFtZXNwYWNlXG5kZWNsYXJlIGdsb2JhbCB7XG4gIC8qKlxuICAgKiBUYWcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyBmb3IgbG9jYWxpemF0aW9uLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogJGxvY2FsaXplIGBzb21lIHN0cmluZyB0byBsb2NhbGl6ZWBcbiAgICogYGBgXG4gICAqXG4gICAqICoqUHJvdmlkaW5nIG1lYW5pbmcsIGRlc2NyaXB0aW9uIGFuZCBpZCoqXG4gICAqXG4gICAqIFlvdSBjYW4gb3B0aW9uYWxseSBzcGVjaWZ5IG9uZSBvciBtb3JlIG9mIGBtZWFuaW5nYCwgYGRlc2NyaXB0aW9uYCBhbmQgYGlkYCBmb3IgYSBsb2NhbGl6ZWRcbiAgICogc3RyaW5nIGJ5IHByZS1wZW5kaW5nIGl0IHdpdGggYSBjb2xvbiBkZWxpbWl0ZWQgYmxvY2sgb2YgdGhlIGZvcm06XG4gICAqXG4gICAqIGBgYHRzXG4gICAqICRsb2NhbGl6ZWA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAaWQ6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqXG4gICAqICRsb2NhbGl6ZWA6bWVhbmluZ3w6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqICRsb2NhbGl6ZWA6ZGVzY3JpcHRpb246c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gICAqICRsb2NhbGl6ZWA6QEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoaXMgZm9ybWF0IGlzIHRoZSBzYW1lIGFzIHRoYXQgdXNlZCBmb3IgYGkxOG5gIG1hcmtlcnMgaW4gQW5ndWxhciB0ZW1wbGF0ZXMuIFNlZSB0aGVcbiAgICogW0FuZ3VsYXIgaTE4biBndWlkZV0oZ3VpZGUvaTE4bi1jb21tb24tcHJlcGFyZSNtYXJrLXRleHQtaW4tY29tcG9uZW50LXRlbXBsYXRlKS5cbiAgICpcbiAgICogKipOYW1pbmcgcGxhY2Vob2xkZXJzKipcbiAgICpcbiAgICogSWYgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIGNvbnRhaW5zIGV4cHJlc3Npb25zLCB0aGVuIHRoZSBleHByZXNzaW9ucyB3aWxsIGJlIGF1dG9tYXRpY2FsbHlcbiAgICogYXNzb2NpYXRlZCB3aXRoIHBsYWNlaG9sZGVyIG5hbWVzIGZvciB5b3UuXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiAkbG9jYWxpemUgYEhpICR7bmFtZX0hIFRoZXJlIGFyZSAke2l0ZW1zLmxlbmd0aH0gaXRlbXMuYDtcbiAgICogYGBgXG4gICAqXG4gICAqIHdpbGwgZ2VuZXJhdGUgYSBtZXNzYWdlLXNvdXJjZSBvZiBgSGkgeyRQSH0hIFRoZXJlIGFyZSB7JFBIXzF9IGl0ZW1zYC5cbiAgICpcbiAgICogVGhlIHJlY29tbWVuZGVkIHByYWN0aWNlIGlzIHRvIG5hbWUgdGhlIHBsYWNlaG9sZGVyIGFzc29jaWF0ZWQgd2l0aCBlYWNoIGV4cHJlc3Npb24gdGhvdWdoLlxuICAgKlxuICAgKiBEbyB0aGlzIGJ5IHByb3ZpZGluZyB0aGUgcGxhY2Vob2xkZXIgbmFtZSB3cmFwcGVkIGluIGA6YCBjaGFyYWN0ZXJzIGRpcmVjdGx5IGFmdGVyIHRoZVxuICAgKiBleHByZXNzaW9uLiBUaGVzZSBwbGFjZWhvbGRlciBuYW1lcyBhcmUgc3RyaXBwZWQgb3V0IG9mIHRoZSByZW5kZXJlZCBsb2NhbGl6ZWQgc3RyaW5nLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gbmFtZSB0aGUgYGl0ZW1zLmxlbmd0aGAgZXhwcmVzc2lvbiBwbGFjZWhvbGRlciBgaXRlbUNvdW50YCB5b3Ugd3JpdGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqICRsb2NhbGl6ZSBgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofTppdGVtQ291bnQ6IGl0ZW1zYDtcbiAgICogYGBgXG4gICAqXG4gICAqICoqRXNjYXBpbmcgY29sb24gbWFya2VycyoqXG4gICAqXG4gICAqIElmIHlvdSBuZWVkIHRvIHVzZSBhIGA6YCBjaGFyYWN0ZXIgZGlyZWN0bHkgYXQgdGhlIHN0YXJ0IG9mIGEgdGFnZ2VkIHN0cmluZyB0aGF0IGhhcyBub1xuICAgKiBtZXRhZGF0YSBibG9jaywgb3IgZGlyZWN0bHkgYWZ0ZXIgYSBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbiB0aGF0IGhhcyBubyBuYW1lIHlvdSBtdXN0IGVzY2FwZVxuICAgKiB0aGUgYDpgIGJ5IHByZWNlZGluZyBpdCB3aXRoIGEgYmFja3NsYXNoOlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogLy8gbWVzc2FnZSBoYXMgYSBtZXRhZGF0YSBibG9jayBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICAgKiAkbG9jYWxpemUgYDpzb21lIGRlc2NyaXB0aW9uOjp0aGlzIG1lc3NhZ2Ugc3RhcnRzIHdpdGggYSBjb2xvbiAoOilgO1xuICAgKiAvLyBubyBtZXRhZGF0YSBibG9jayBzbyB0aGUgY29sb24gbXVzdCBiZSBlc2NhcGVkXG4gICAqICRsb2NhbGl6ZSBgXFw6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAgICogYGBgXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIG5hbWVkIHN1YnN0aXR1dGlvbiBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICAgKiAkbG9jYWxpemUgYCR7bGFiZWx9OmxhYmVsOjogJHt9YFxuICAgKiAvLyBhbm9ueW1vdXMgc3Vic3RpdHV0aW9uIHNvIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICAgKiAkbG9jYWxpemUgYCR7bGFiZWx9XFw6ICR7fWBcbiAgICogYGBgXG4gICAqXG4gICAqICoqUHJvY2Vzc2luZyBsb2NhbGl6ZWQgc3RyaW5nczoqKlxuICAgKlxuICAgKiBUaGVyZSBhcmUgdGhyZWUgc2NlbmFyaW9zOlxuICAgKlxuICAgKiAqICoqY29tcGlsZS10aW1lIGlubGluaW5nKio6IHRoZSBgJGxvY2FsaXplYCB0YWcgaXMgdHJhbnNmb3JtZWQgYXQgY29tcGlsZSB0aW1lIGJ5IGFcbiAgICogdHJhbnNwaWxlciwgcmVtb3ZpbmcgdGhlIHRhZyBhbmQgcmVwbGFjaW5nIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRoIGEgdHJhbnNsYXRlZFxuICAgKiBsaXRlcmFsIHN0cmluZyBmcm9tIGEgY29sbGVjdGlvbiBvZiB0cmFuc2xhdGlvbnMgcHJvdmlkZWQgdG8gdGhlIHRyYW5zcGlsYXRpb24gdG9vbC5cbiAgICpcbiAgICogKiAqKnJ1bi10aW1lIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgcmVwbGFjZXMgYW5kXG4gICAqIHJlb3JkZXJzIHRoZSBwYXJ0cyAoc3RhdGljIHN0cmluZ3MgYW5kIGV4cHJlc3Npb25zKSBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgd2l0aCBzdHJpbmdzXG4gICAqIGZyb20gYSBjb2xsZWN0aW9uIG9mIHRyYW5zbGF0aW9ucyBsb2FkZWQgYXQgcnVuLXRpbWUuXG4gICAqXG4gICAqICogKipwYXNzLXRocm91Z2ggZXZhbHVhdGlvbioqOiB0aGUgYCRsb2NhbGl6ZWAgdGFnIGlzIGEgcnVuLXRpbWUgZnVuY3Rpb24gdGhhdCBzaW1wbHkgZXZhbHVhdGVzXG4gICAqIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRob3V0IGFwcGx5aW5nIGFueSB0cmFuc2xhdGlvbnMgdG8gdGhlIHBhcnRzLiBUaGlzXG4gICAqIHZlcnNpb24gaXMgdXNlZCBkdXJpbmcgZGV2ZWxvcG1lbnQgb3Igd2hlcmUgdGhlcmUgaXMgbm8gbmVlZCB0byB0cmFuc2xhdGUgdGhlIGxvY2FsaXplZFxuICAgKiB0ZW1wbGF0ZSBsaXRlcmFscy5cbiAgICpcbiAgICogQHBhcmFtIG1lc3NhZ2VQYXJ0cyBhIGNvbGxlY3Rpb24gb2YgdGhlIHN0YXRpYyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICAgKiBAcGFyYW0gZXhwcmVzc2lvbnMgYSBjb2xsZWN0aW9uIG9mIHRoZSB2YWx1ZXMgb2YgZWFjaCBwbGFjZWhvbGRlciBpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB0aGUgdHJhbnNsYXRlZCBzdHJpbmcsIHdpdGggdGhlIGBtZXNzYWdlUGFydHNgIGFuZCBgZXhwcmVzc2lvbnNgIGludGVybGVhdmVkIHRvZ2V0aGVyLlxuICAgKi9cbiAgY29uc3QgJGxvY2FsaXplOiBMb2NhbGl6ZUZuO1xufVxuIl19