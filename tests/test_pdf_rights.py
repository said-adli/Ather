import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pdf_import', Path(__file__).resolve().parents[1] / 'scripts/import-pdf-library.py')
pdf_import = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pdf_import)

DESIGN_AND_ORIGINAL = ('جميع حقوق النشر الخاصة بتصميم هذا الكتاب وتصميم الغلاف مرخصة بموجب رخصة '
                       'المشاع الإبداعي: نسب المصنف، الإصدار ٤.٠. جميع حقوق النشر الخاصة بنص العمل الأصلي خاضعة للملكية العامة.')
TRANSLATION = ('جميع حقوق النشر الخاصة بتصميم هذا الكتاب، وتصميم الغلاف، والترجمة العربية لنص هذا الكتاب '
               'مرخصة بموجب رخصة المشاع الإبداعي: نسب المصنف، الإصدار ٤.٠. '
               'جميع حقوق النشر الخاصة بنص العمل الأصلي خاضعة للملكية العامة.')


class RightsTest(unittest.TestCase):
    def test_design_grant_does_not_authorize_translation(self):
        with self.assertRaises(ValueError):
            pdf_import.verify_license('صدرت هذه الترجمة عام ١٩٥٣. ' + DESIGN_AND_ORIGINAL, 'licensed-translation')

    def test_explicit_translation_grant_and_original_arabic(self):
        self.assertEqual(pdf_import.verify_license(TRANSLATION, 'licensed-translation'), 'CC BY 4.0')
        self.assertEqual(pdf_import.verify_license(DESIGN_AND_ORIGINAL, 'arabic-public-domain'), 'CC BY 4.0')

    def test_translation_cannot_be_classified_as_original(self):
        with self.assertRaises(ValueError):
            pdf_import.verify_license('صدرت هذه الترجمة عام ١٩٥٣. ' + DESIGN_AND_ORIGINAL, 'arabic-public-domain')

    def test_missing_classification_is_rejected(self):
        with self.assertRaises(ValueError):
            pdf_import.verify_license(TRANSLATION, None)


if __name__ == '__main__':
    unittest.main()
